from decimal import Decimal
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.biblioteca.libros.document import Libro, Idiomas
from src.modules.biblioteca.libros.schema import LibroCreate, LibroUpdate, AutorDestacadoResponse
from src.modules.biblioteca.libros.repo import LibroRepo
from src.modules.compra.document import Compras, EstadoCompraEnum
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.biblioteca.autor.document import Autor
from src.modules.biblioteca.editorial.document import Editorial
from src.modules.biblioteca.genero.document import Genero

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

        libro = Libro(**data.model_dump())
        await libro.insert()
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
        compras = await Compras.find(
            Compras.usuario_id == usuario_id,
            Compras.estado.in_(list(ESTADOS_CON_ACCESO)),
        ).to_list()

        return any(
            item.producto_id == libro_id
            for compra in compras
            for item in compra.items
        )

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