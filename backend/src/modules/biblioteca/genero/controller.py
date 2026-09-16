from beanie import PydanticObjectId
from src.modules.biblioteca.genero.document import Genero
from src.modules.biblioteca.genero.schema import (
    GeneroCreate,
    GeneroUpdate
)
from src.modules.biblioteca.genero.service import GeneroService

class GeneroController:
    def __init__(self):
        self.service = GeneroService()

    async def crear(self, data: GeneroCreate) -> Genero:
        return await self.service.crear(data)

    async def actualizar(self, id: PydanticObjectId, data: GeneroUpdate) -> Genero:
        return await self.service.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Genero:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Genero:
        return await self.service.desactivar(id)

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Genero], int]:
        return await self.service.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Genero], int]:
        return await self.service.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Genero], int]:
        return await self.service.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Genero]:
        return await self.service.listar_publicas()

    async def obtener_id(self, id: PydanticObjectId) -> Genero:
        return await self.service.obtener_por_id(id)