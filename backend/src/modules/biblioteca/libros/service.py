from decimal import Decimal
from fastapi import HTTPException, status, UploadFile
from beanie import PydanticObjectId
from src.modules.biblioteca.libros.document import Libro, Idiomas
from src.modules.biblioteca.libros.schema import LibroCreate, LibroUpdate, AutorDestacadoResponse
from src.modules.biblioteca.libros.repo import LibroRepo
from src.modules.compra.document import Compras, EstadoCompraEnum, TipoItemCompra
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.biblioteca.autor.document import Autor
from src.modules.biblioteca.editorial.document import Editorial
from src.modules.biblioteca.genero.document import Genero
from src.core.storage.r2 import storage
from src.core.storage.watermark import generar_version_personal_wm
from src.core.storage.cloudinary_client import cloudinary_storage

ESTADOS_CON_ACCESO = (
    EstadoCompraEnum.PAGADO,
    EstadoCompraEnum.ENVIADO,
    EstadoCompraEnum.ENTREGADO,
)

class LibroService:
    def __init__(self):
        self.repo = LibroRepo()

    async def _validar_relaciones(
        self,
        autor_id: PydanticObjectId | None = None,
        editorial_id: PydanticObjectId | None = None,
        genero_id: PydanticObjectId | None = None,
    ) -> None:
        if autor_id:
            autor = await Autor.get(autor_id)
            if not autor or not autor.activo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El autor no existe o está inactivo",
                )

        if editorial_id:
            editorial = await Editorial.get(editorial_id)
            if not editorial or not editorial.activo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="La editorial no existe o está inactiva",
                )

        if genero_id:
            genero = await Genero.get(genero_id)
            if not genero or not genero.activo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El género no existe o está inactivo",
                )

    async def _validar_duplicados(
        self,
        nombre: str,
        autor_id: PydanticObjectId,
        editorial_id: PydanticObjectId,
        genero_id: PydanticObjectId,
        edicion: str | None,
        anio_publicacion: int,
        isbn: str | None = None,
        sku: str | None = None,
        excluir_id: PydanticObjectId | None = None,
    ) -> None:
        if await self.repo.existe_libro_duplicado(
            nombre=nombre,
            autor_id=autor_id,
            editorial_id=editorial_id,
            genero_id=genero_id,
            edicion=edicion,
            anio_publicacion=anio_publicacion,
            excluir_id=excluir_id,
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Ya existe un libro '{nombre}' con esa edición, "
                    "autor, editorial, género y año"
                ),
            )

        if isbn and await self.repo.isbn_existe(isbn, excluir_id=excluir_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El ISBN '{isbn}' ya está registrado en otro libro",
            )

        if sku and await self.repo.sku_existe(sku, excluir_id=excluir_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El SKU '{sku}' ya está registrado en otro libro",
            )

    async def crear(self, data: LibroCreate) -> Libro:
        await self._validar_relaciones(
            autor_id=data.autor_id,
            editorial_id=data.editorial_id,
            genero_id=data.genero_id,
        )

        await self._validar_duplicados(
            nombre=data.nombre,
            autor_id=data.autor_id,
            editorial_id=data.editorial_id,
            genero_id=data.genero_id,
            edicion=data.edicion,
            anio_publicacion=data.anio_publicacion,
            isbn=data.isbn,
            sku=data.sku,
        )

        payload = data.model_dump()
        if payload.get("stock", 0) == 0:
            payload["activo"] = False

        libro = Libro(**payload)
        await libro.insert()
        return libro

    async def subir_archivo(
        self, libro_id: PydanticObjectId, archivo: UploadFile
    ) -> Libro:

        libro = await self.obtener_por_id(libro_id)

        if not archivo.filename or not archivo.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo debe ser un PDF (.pdf)",
            )
        if archivo.content_type not in ("application/pdf", "application/x-pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El tipo de contenido debe ser application/pdf",
            )

        key = await storage.subir_pdf_original(libro_id, archivo)
        libro.contenido = key
        await libro.save()

        return libro

    async def autores_destacados(self, limit: int = 6) -> list[AutorDestacadoResponse]:
        conteo = await self.repo.contar_por_autor(limit=limit)
        resultado = []
        for fila in conteo:
            autor = await Autor.get(fila["_id"])
            if not autor or not autor.activo:
                continue
            resultado.append(
                AutorDestacadoResponse(
                    id=autor.id,
                    nombre=autor.nombre,
                    apellido=autor.apellido,
                    imagen=autor.imagen,
                    pais_nacimiento=autor.pais_nacimiento,
                    total_libros=fila["total"],
                )
            )
        return resultado

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Libro], int]:
        return await self.repo.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Libro], int]:
        return await self.repo.listar_activos(skip=skip, limit=limit)
    
    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Libro], int]:
        return await self.repo.listar_inactivos(skip=skip, limit=limit)

    async def actualizar(self, id: PydanticObjectId, data: LibroUpdate) -> Libro:
        libro = await self.obtener_por_id(id)

        await self._validar_relaciones(
            autor_id=data.autor_id,
            editorial_id=data.editorial_id,
            genero_id=data.genero_id,
        )

        await self._validar_duplicados(
            nombre=data.nombre if data.nombre is not None else libro.nombre,
            autor_id=data.autor_id or libro.autor_id,
            editorial_id=data.editorial_id or libro.editorial_id,
            genero_id=data.genero_id or libro.genero_id,
            edicion=data.edicion if data.edicion is not None else libro.edicion,
            anio_publicacion=(
                data.anio_publicacion
                if data.anio_publicacion is not None
                else libro.anio_publicacion
            ),
            isbn=data.isbn,
            sku=data.sku,
            excluir_id=id,
        )

        stock_final = data.stock if data.stock is not None else libro.stock
        if stock_final == 0:
            data = data.model_copy(update={"activo": False})

        resultado = await self.repo.actualizar(id, data)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el libro",
            )
        return resultado

    async def activar(self, id: PydanticObjectId) -> Libro:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Libro:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)

    async def obtener_por_id(self, id: PydanticObjectId) -> Libro:
        libro = await self.repo.obtener_por_id(id)
        if not libro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Libro no encontrado",
            )
        return libro

    async def obtener_por_isbn(self, isbn: str) -> Libro:
        libro = await self.repo.obtener_por_isbn(isbn)
        if not libro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe un libro con el ISBN '{isbn}'",
            )
        return libro

    async def obtener_por_sku(self, sku: str) -> Libro:
        libro = await self.repo.obtener_por_sku(sku)
        if not libro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe un libro con el SKU '{sku}'",
            )
        return libro

    async def buscar(
        self,
        nombre: str | None = None,
        autor_id: PydanticObjectId | None = None,
        editorial_id: PydanticObjectId | None = None,
        genero_id: PydanticObjectId | None = None,
        idioma: Idiomas | None = None,
        anio_desde: int | None = None,
        anio_hasta: int | None = None,
        precio_min: Decimal | None = None,
        precio_max: Decimal | None = None,
        solo_activos: bool = True,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Libro], int]:
        return await self.repo.buscar_por_filtro(
            nombre=nombre,
            autor_id=autor_id,
            editorial_id=editorial_id,
            genero_id=genero_id,
            idioma=idioma,
            anio_desde=anio_desde,
            anio_hasta=anio_hasta,
            precio_min=precio_min,
            precio_max=precio_max,
            solo_activos=solo_activos,
            skip=skip,
            limit=limit,
        )

    async def _usuario_compro_libro(
        self,
        libro_id: PydanticObjectId,
        usuario_id: PydanticObjectId,
    ) -> bool:
        estados_con_acceso = [e.value for e in ESTADOS_CON_ACCESO]

        compra = await Compras.find_one(
            {
                "usuario_id": usuario_id,
                "estado": {"$in": estados_con_acceso},
                "items.producto_id": libro_id,
            }
        )

        return compra is not None

    async def mis_libros(self, usuario_id: PydanticObjectId) -> list[Libro]:
        compras = await Compras.find(
            {
                "usuario_id": usuario_id,
                "estado": {"$in": [e.value for e in ESTADOS_CON_ACCESO]},
            }
        ).to_list()
        
        libro_ids = {
            item.producto_id
            for compra in compras
            for item in compra.items
            if item.tipo == TipoItemCompra.LIBRO
        }

        if not libro_ids:
            return []

        return await Libro.find({"_id": {"$in": list(libro_ids)}}).to_list()

    async def obtener_contenido(self, libro_id: PydanticObjectId, usuario: Usuario) -> Libro:
        libro = await self.obtener_por_id(libro_id)
        if usuario.rol == RolUsuario.ADMIN:
            return libro

        if not await self._usuario_compro_libro(libro.id, usuario.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Debes comprar este libro para acceder a su contenido. "
                    f"Adquiérelo por ${libro.precio:,.2f} en la tienda."
                ),
            )

        return libro

    async def preparar_lectura(
        self, libro_id: PydanticObjectId, usuario: Usuario
    ) -> dict:

        libro = await self.obtener_por_id(libro_id)
        if usuario.rol != RolUsuario.ADMIN:
            if not await self._usuario_compro_libro(libro.id, usuario.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Debes comprar este libro para acceder a su contenido.",
                )

        if not storage.existe_version_personal(libro.id, str(usuario.id)):
            if not storage.existe_original(libro.id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="El archivo PDF de este libro no está disponible.",
                )
            
            original_bytes = storage.descargar_original(libro.id)
            
            personal_bytes = generar_version_personal_wm(
                original_bytes,
                libro.id,
                str(usuario.id),
                usuario.correo,
            )
            
            storage.subir_version_personal(libro.id, str(usuario.id), personal_bytes)

        key = storage.obtener_version_personal(libro.id, str(usuario.id))
        url_firmada = storage.firmar_url_descarga(key, expira_segundos=900)

        return {
            "libro_id": libro.id,
            "titulo": libro.nombre,
            "url_lectura": url_firmada,
            "expira_en_segundos": 900,
        }

    async def actualizar_portada(
        self, libro_id: PydanticObjectId, imagen: UploadFile
    ) -> Libro:
        libro = await self.obtener_por_id(libro_id)

        if not imagen.content_type or not imagen.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo debe ser una imagen",
            )

        contenido = await imagen.read()

        MAX_SIZE = 5 * 1024 * 1024
        if len(contenido) > MAX_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La imagen no puede superar los 5 MB",
            )

        if libro.portada_public_id:
            await cloudinary_storage.eliminar_imagen(libro.portada_public_id)

        resultado = await cloudinary_storage.subir_imagen(
            contenido=contenido,
            carpeta="libros",
            public_id=str(libro.id),
            transformaciones={
                "width": 600,
                "height": 900,
                "crop": "fill",
                "gravity": "auto",
            },
        )

        libro.portada = resultado["url"]
        libro.portada_public_id = resultado["public_id"]
        await libro.save()

        return libro

    async def eliminar_portada(self, libro_id: PydanticObjectId) -> Libro:
        libro = await self.obtener_por_id(libro_id)

        if libro.portada_public_id:
            await cloudinary_storage.eliminar_imagen(libro.portada_public_id)

        libro.portada = None
        libro.portada_public_id = None
        await libro.save()

        return libro