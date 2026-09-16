from decimal import Decimal
from beanie import PydanticObjectId
from src.modules.biblioteca.libros.document import Libro, Idiomas
from src.modules.biblioteca.libros.schema import LibroCreate, LibroUpdate
from src.modules.biblioteca.libros.service import LibroService
from src.modules.usuarios.document import Usuario


class LibroController:
    def __init__(self):
        self.service = LibroService()

    # ========== OPERACIONES ==========

    async def crear(self, data: LibroCreate) -> Libro:
        return await self.service.crear(data)

    async def actualizar(self, id: PydanticObjectId, data: LibroUpdate) -> Libro:
        return await self.service.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Libro:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Libro:
        return await self.service.desactivar(id)

    # ========== CONSULTAS ==========

    async def obtener_por_id(self, id: PydanticObjectId) -> Libro:
        return await self.service.obtener_por_id(id)

    async def obtener_por_isbn(self, isbn: str) -> Libro:
        return await self.service.obtener_por_isbn(isbn)

    async def obtener_por_sku(self, sku: str) -> Libro:
        return await self.service.obtener_por_sku(sku)

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
        return await self.service.buscar(
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

    # ========== CONTENIDO PROTEGIDO ==========

    async def obtener_contenido(self, libro_id: PydanticObjectId, usuario: Usuario) -> Libro:
        return await self.service.obtener_contenido(libro_id, usuario)