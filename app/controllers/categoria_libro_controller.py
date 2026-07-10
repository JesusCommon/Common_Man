from beanie import PydanticObjectId
from app.schemas.categorias_libros_schema import (
    CategoriaCreate,
    CategoriasResponse,
    CategoriaUpdate
)
from app.services.categorias_libros_service import categoriaService


class CategoriaController:
    def __init__(self):
        self.service = categoriaService()

    async def crear(self, data: CategoriaCreate) -> CategoriasResponse:
        categoria = await self.service.crear(data)
        return CategoriasResponse.model_validate(categoria)

    async def obtener_id(self, id: PydanticObjectId) -> CategoriasResponse:
        categoria = await self.service.obtener_por_id(id)
        return CategoriasResponse.model_validate(categoria)

    async def actualizar(self, id: PydanticObjectId, data: CategoriaUpdate) -> CategoriasResponse:
        categoria = await self.service.actualizar(id, data)
        return CategoriasResponse.model_validate(categoria)

    async def listar(self) -> list[CategoriasResponse]:
        categorias = await self.service.listar()
        return [CategoriasResponse.model_validate(u) for u in categorias]

    async def listar_activos(self) -> list[CategoriasResponse]:
        categorias = await self.service.listar_activos()
        return [CategoriasResponse.model_validate(u) for u in categorias]

    async def activar(self, id: PydanticObjectId) -> CategoriasResponse:
        categoria = await self.service.activar(id)
        return CategoriasResponse.model_validate(categoria)

    async def desactivar(self, id: PydanticObjectId) -> CategoriasResponse:
        categoria = await self.service.desactivar(id)
        return CategoriasResponse.model_validate(categoria)