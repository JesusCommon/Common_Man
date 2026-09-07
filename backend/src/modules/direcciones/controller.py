from beanie import PydanticObjectId
from src.modules.direcciones.document import Direcciones
from src.modules.direcciones.schema import DireccionCreate, DireccionUpdate
from src.modules.direcciones.service import DireccionService

class DireccionController:
    def __init__(self):
        self.service = DireccionService()

    async def crear(
        self, data: DireccionCreate, usuario_id: PydanticObjectId
    ) -> Direcciones:
        return await self.service.crear(data, usuario_id)

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Direcciones], int]:
        return await self.service.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit
        )

    async def obtener_por_id(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        return await self.service.obtener_por_id(id, usuario_id)

    async def actualizar(
        self,
        id: PydanticObjectId,
        data: DireccionUpdate,
        usuario_id: PydanticObjectId,
    ) -> Direcciones:
        return await self.service.actualizar(id, data, usuario_id)

    async def marcar_predeterminada(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        return await self.service.marcar_predeterminada(id, usuario_id)

    async def desactivar(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        return await self.service.desactivar(id, usuario_id)