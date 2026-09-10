from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.notificaciones.document import Notificacion
from src.modules.notificaciones.schema import NotificacionCreate
from src.modules.notificaciones.repo import NotificacionRepo
from src.core.websocket.manager import manager

class NotificacionService:
    def __init__(self):
        self.repo = NotificacionRepo()

    async def crear_y_enviar(self, data: NotificacionCreate) -> Notificacion:
        notificacion = Notificacion(
            usuario_id=data.usuario_id,
            tipo=data.tipo,
            titulo=data.titulo,
            mensaje=data.mensaje,
            referencia_id=data.referencia_id,
            referencia_tipo=data.referencia_tipo,
            accion_url=data.accion_url,
            leida=False
        )
        await notificacion.insert()
        payload = {
            "type": "NEW_NOTIFICATION",
            "data": {
                "id": str(notificacion.id),
                "tipo": notificacion.tipo.value,
                "titulo": notificacion.titulo,
                "mensaje": notificacion.mensaje,
                "leida": notificacion.leida,
                "fecha_creacion": notificacion.fecha_creacion.isoformat(),
                "accion_url": notificacion.accion_url
            }
        }

        if data.usuario_id:
            await manager.send_personal_message(payload, str(data.usuario_id))
        else:
            await manager.broadcast(payload)

        return notificacion

    async def listar(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
        solo_no_leidas: bool = False,
    ) -> tuple[list[Notificacion], int]:
        return await self.repo.listar_por_usuario(
            usuario_id, skip, limit, solo_no_leidas
        )

    async def contar_no_leidas(self, usuario_id: PydanticObjectId) -> int:
        return await self.repo.contar_no_leidas(usuario_id)

    async def marcar_leida(self, id: PydanticObjectId, usuario_id: PydanticObjectId) -> Notificacion:
        notif = await self.repo.marcar_como_leida(id, usuario_id)
        if not notif:
            raise HTTPException(status_code=404, detail="Notificación no encontrada o no pertenece al usuario")
        return notif

    async def marcar_todas_leidas(self, usuario_id: PydanticObjectId) -> int:
        return await self.repo.marcar_todas_como_leidas(usuario_id)

    async def eliminar(self, id: PydanticObjectId, usuario_id: PydanticObjectId) -> bool:
        return await self.repo.eliminar(id, usuario_id)