from beanie import PydanticObjectId
from app.schemas.tienda_schema import (
    TiendaCreate,
    TiendaUpdate,
    TiendaResponse
)
from app.services.tienda_service import TiendaService


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