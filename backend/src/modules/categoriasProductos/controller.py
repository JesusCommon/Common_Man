from beanie import PydanticObjectId
from src.modules.categoriasProductos.document import Categorias
from src.modules.categoriasProductos.schema import (
    CategoriaCreate,
    CategoriaUpdate
)
from src.modules.categoriasProductos.service import CategoriaService

class CategoriaController:
    def __init__(self):
        self.service = CategoriaService()

    async def crear(self, data: CategoriaCreate) -> Categorias:
        return await self.service.crear(data)

    async def actualizar(self, id: PydanticObjectId, data: CategoriaUpdate) -> Categorias:
        return await self.service.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Categorias:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Categorias:
        return await self.service.desactivar(id)

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Categorias], int]:
        return await self.service.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Categorias], int]:
        return await self.service.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Categorias], int]:
        return await self.service.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Categorias]:
        return await self.service.listar_publicas()

    async def obtener_id(self, id: PydanticObjectId) -> Categorias:
        return await self.service.obtener_por_id(id)