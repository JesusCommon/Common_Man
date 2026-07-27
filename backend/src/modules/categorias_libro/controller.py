from beanie import PydanticObjectId
from src.modules.categorias_libro.schema import (
    CategoriaLibroCreate,
    CategoriaLibroUpdate,
    CategoriaLibroResponse
)
from src.modules.categorias_libro.service import CategoriaLibroService

class CategoriaLibroController:
    def __init__(self):
        self.service = CategoriaLibroService()

    async def crear(self, data: CategoriaLibroCreate) -> CategoriaLibroResponse:
        categoria = await self.service.crear(data)
        return CategoriaLibroResponse.model_validate(categoria)
    
    async def obtener_id(self, id: PydanticObjectId) -> CategoriaLibroResponse:
        categoria = await self.service.obtener_por_id(id)
        return CategoriaLibroResponse.model_validate(categoria)

    async def actualizar(self, id: PydanticObjectId, data: CategoriaLibroUpdate) -> CategoriaLibroResponse:
        categoria = await self.service.actualizar(id, data)
        return CategoriaLibroResponse.model_validate(categoria)
    
    async def listar(self) -> list[CategoriaLibroResponse]:
        categorias = await self.service.listar()
        return [CategoriaLibroResponse.model_validate(u) for u in categorias]
    
    async def listar_activos(self) -> list[CategoriaLibroResponse]:
        categorias = await self.service.listar_activos()
        return [CategoriaLibroResponse.model_validate(u) for u in categorias]
    
    async def activar(self, id: PydanticObjectId) -> CategoriaLibroResponse:
        categoria = await self.service.activar(id)
        return CategoriaLibroResponse.model_validate(categoria)
    
    async def desactivar(self, id: PydanticObjectId) -> CategoriaLibroResponse:
        categoria = await self.service.desactivar(id)
        return CategoriaLibroResponse.model_validate(categoria)