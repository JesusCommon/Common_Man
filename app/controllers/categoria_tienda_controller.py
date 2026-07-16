from beanie import PydanticObjectId
from app.schemas.categoria_tienda_schema import (
    CategoriaCreate,
    CategoriaResponse,
    CategoriaUpdate
)
from app.services.categoria_tienda_service import categoriaService


class CategoriaController:
    def __init__(self):
        self.service = categoriaService()

    async def crear(self, data: CategoriaCreate) -> CategoriaResponse:
        categoria = await self.service.crear(data)
        return CategoriaResponse.model_validate(categoria)

    async def obtener_id(self, id: PydanticObjectId) -> CategoriaResponse:
        categoria = await self.service.obtener_por_id(id)
        return CategoriaResponse.model_validate(categoria)

    async def actualizar(self, id: PydanticObjectId, data: CategoriaUpdate) -> CategoriaResponse:
        categoria = await self.service.actualizar(id, data)
        return CategoriaResponse.model_validate(categoria)

    async def listar(self) -> list[CategoriaResponse]:
        categorias = await self.service.listar()
        return [CategoriaResponse.model_validate(u) for u in categorias]

    async def listar_activos(self) -> list[CategoriaResponse]:
        categorias = await self.service.listar_activos()
        return [CategoriaResponse.model_validate(u) for u in categorias]

    async def activar(self, id: PydanticObjectId) -> CategoriaResponse:
        categoria = await self.service.activar(id)
        return CategoriaResponse.model_validate(categoria)

    async def desactivar(self, id: PydanticObjectId) -> CategoriaResponse:
        categoria = await self.service.desactivar(id)
        return CategoriaResponse.model_validate(categoria)