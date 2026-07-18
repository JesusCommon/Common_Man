from beanie import PydanticObjectId
from app.schemas.libros_schema import (
    LibroCreate,
    LibroUpdate,
    LibroResponse
)
from app.services.libros_service import LibroService


class LibroController:
    def __init__(self):
        self.service = LibroService()

    async def crear(self, data: LibroCreate) -> LibroResponse:
        libro = await self.service.crear(data)
        return LibroResponse.model_validate(libro)

    async def obtener_id(self, id: PydanticObjectId) -> LibroResponse:
        libro = await self.service.obtener_por_id(id)
        return LibroResponse.model_validate(libro)

    async def actualizar(self, id: PydanticObjectId, data: LibroUpdate) -> LibroResponse:
        libro = await self.service.actualizar(id, data)
        return LibroResponse.model_validate(libro)

    async def listar(self) -> list[LibroResponse]:
        libros = await self.service.listar()
        return [LibroResponse.model_validate(u) for u in libros]

    async def listar_activos(self) -> list[LibroResponse]:
        libros = await self.service.listar_activos()
        return [LibroResponse.model_validate(u) for u in libros]

    async def activar(self, id: PydanticObjectId) -> LibroResponse:
        libro = await self.service.activar(id)
        return LibroResponse.model_validate(libro)

    async def desactivar(self, id: PydanticObjectId) -> LibroResponse:
        libro = await self.service.desactivar(id)
        return LibroResponse.model_validate(libro)
    
    async def buscar_con_filtro(
        self,
        nombre: str | None = None,
        categoria_id: PydanticObjectId | None = None,
        precio_min: float | None = None,
        precio_max: float | None = None,
        idioma: str | None = None,
        anio_publicacion: int | None = None,
        autor: str | None = None,
        editorial: str | None = None,
        ordenar_por: str = "fecha_creacion",
        orden_desc: bool = True,
        skip: int = 0,
        limit: int = 20
    ) -> list[LibroResponse]:
        libros = await self.service.buscar_con_filtro(
            nombre=nombre,
            categoria_id=categoria_id,
            precio_min=precio_min,
            precio_max=precio_max,
            idioma=idioma,
            anio_publicacion=anio_publicacion,
            autor=autor,
            editorial=editorial,
            orden_por=ordenar_por,
            orden_desc=orden_desc,
            skip=skip,
            limit=limit,
        )
        return [LibroResponse.model_validate(u) for u in libros]
    
    