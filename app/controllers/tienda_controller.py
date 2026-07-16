from beanie import PydanticObjectId
from app.schemas.tienda_schema import (
    TiendaCreate,
    TiendaUpdate,
    TiendaResponse
)
from app.services.tienda_service import TiendaService
from uuid import UUID

class TiendaController:
    def __init__(self):
        self.service = TiendaService()

    async def crear(self, data: TiendaCreate) -> TiendaResponse:
        producto = await self.service.crear(data)
        return TiendaResponse.model_validate(producto)

    async def obtener_id(self, id: PydanticObjectId) -> TiendaResponse:
        producto = await self.service.obtener_por_id(id)
        return TiendaResponse.model_validate(producto)

    async def actualizar(self, id: PydanticObjectId, data: TiendaUpdate) -> TiendaResponse:
        producto = await self.service.actualizar(id, data)
        return TiendaResponse.model_validate(producto)

    async def listar(self) -> list[TiendaResponse]:
        productos = await self.service.listar()
        return [TiendaResponse.model_validate(u) for u in productos]

    async def listar_activos(self) -> list[TiendaResponse]:
        productos = await self.service.listar_activos()
        return [TiendaResponse.model_validate(u) for u in productos]

    async def activar(self, id: PydanticObjectId) -> TiendaResponse:
        producto = await self.service.activar(id)
        return TiendaResponse.model_validate(producto)

    async def desactivar(self, id: PydanticObjectId) -> TiendaResponse:
        producto = await self.service.desactivar(id)
        return TiendaResponse.model_validate(producto)
    
    async def obtener_por_identificador(self, identificador: UUID) -> TiendaResponse:
        usuario = await self.service.obtener_por_identificador(identificador)
        return TiendaResponse.model_validate(usuario)

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        categoria_id: PydanticObjectId | None = None,
        precio_min: float | None = None,
        precio_max: float | None = None,
        disponible: bool | None = None,
        ordenar_por: str = "fecha_creacion",
        orden_desc: bool = True,
        skip: int = 0,
        limit: int = 20,
    ) -> list[TiendaResponse]:
        productos = await self.service.buscar_por_filtro(
            nombre=nombre,
            categoria_id=categoria_id,
            precio_min=precio_min,
            precio_max=precio_max,
            disponible=disponible,
            ordenar_por=ordenar_por,
            orden_desc=orden_desc,
            skip=skip,
            limit=limit,
        )
        return [TiendaResponse.model_validate(u) for u in productos]