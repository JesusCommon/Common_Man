from beanie import PydanticObjectId
from src.modules.biblioteca.editorial.document import Editorial
from src.modules.biblioteca.editorial.schema import (
    EditorialCreate,
    EditorialUpdate
)
from src.modules.biblioteca.editorial.service import EditorialService

class EditorialController:
    def __init__(self):
        self.service = EditorialService()

    async def crear(self, data: EditorialCreate) -> Editorial:
        return await self.service.crear(data)

    async def actualizar(self, id: PydanticObjectId, data: EditorialUpdate) -> Editorial:
        return await self.service.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Editorial:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Editorial:
        return await self.service.desactivar(id)

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Editorial], int]:
        return await self.service.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Editorial], int]:
        return await self.service.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Editorial], int]:
        return await self.service.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Editorial]:
        return await self.service.listar_publicas()

    async def obtener_id(self, id: PydanticObjectId) -> Editorial:
        return await self.service.obtener_por_id(id)