from beanie import PydanticObjectId
from src.modules.notificaciones.service import NotificacionService
from src.modules.notificaciones.schema import NotificacionCreate

class NotificacionController:
    def __init__(self):
        self.service = NotificacionService()

    async def listar(
        self, 
        usuario_id: PydanticObjectId, 
        skip: int = 0, 
        limit: int = 20, 
        solo_no_leidas: bool = False
    ):
        return await self.service.listar(
            usuario_id, skip, limit, solo_no_leidas
        )

    async def contar_no_leidas(self, usuario_id: PydanticObjectId) -> int:
        return await self.service.contar_no_leidas(usuario_id)

    async def marcar_leida(self, id: PydanticObjectId, usuario_id: PydanticObjectId):
        return await self.service.marcar_leida(id, usuario_id)

    async def marcar_todas_leidas(self, usuario_id: PydanticObjectId) -> int:
        return await self.service.marcar_todas_leidas(usuario_id)

    async def eliminar(self, id: PydanticObjectId, usuario_id: PydanticObjectId) -> bool:
        return await self.service.eliminar(id, usuario_id)

    async def crear_y_enviar(self, data: NotificacionCreate):
        return await self.service.crear_y_enviar(data)