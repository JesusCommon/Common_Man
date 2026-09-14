from fastapi import HTTPException
from beanie import PydanticObjectId
from src.modules.notificaciones.document import Notificacion
from src.modules.notificaciones.schema import NotificacionCreate
from src.modules.notificaciones.repo import NotificacionRepo
from src.core.websocket.manager import manager

class NotificacionService:
    def __init__(self):
        self.repo = NotificacionRepo()

    async def crear_y_enviar(self, data: NotificacionCreate) -> Notificacion:
        if data.agrupable and data.referencia_id and data.usuario_id:
            existente = await Notificacion.find_one(
                Notificacion.usuario_id == data.usuario_id,
                Notificacion.referencia_id == data.referencia_id,
                Notificacion.tipo == data.tipo,
                Notificacion.leida == False,
            )
            
            if existente:
                existente.contador += 1
                
                if data.tipo.value == "soporte":
                    existente.titulo = "Respuestas de soporte"
                    existente.mensaje = (
                        f"Tienes {existente.contador} "
                        f"{'mensaje nuevo' if existente.contador == 1 else 'mensajes nuevos'} "
                        f"en tu reporte."
                    )
                elif data.tipo.value == "seguidores":
                    existente.titulo = "Nuevos seguidores"
                    existente.mensaje = (
                        f"Tienes {existente.contador} "
                        f"{'nuevo seguidor' if existente.contador == 1 else 'nuevos seguidores'}."
                    )
                
                await existente.save()
                
                payload = self._construir_payload(existente, tipo_evento="NOTIFICATION_UPDATED")
                await manager.send_to_user(str(data.usuario_id), payload)
                
                return existente
        
        notificacion = Notificacion(
            usuario_id=data.usuario_id,
            tipo=data.tipo,
            titulo=data.titulo,
            mensaje=data.mensaje,
            referencia_id=data.referencia_id,
            referencia_tipo=data.referencia_tipo,
            accion_url=data.accion_url,
            leida=False,
            contador=1,
        )
        await notificacion.insert()
        payload = self._construir_payload(notificacion, tipo_evento="NEW_NOTIFICATION")
        
        if data.usuario_id:
            await manager.send_to_user(str(data.usuario_id), payload)
        else:
            await manager.broadcast(payload)

        return notificacion

    def _construir_payload(self, notificacion: Notificacion, tipo_evento: str) -> dict:
        """Construye el payload para WebSocket"""
        return {
            "type": tipo_evento,
            "data": {
                "id": str(notificacion.id),
                "tipo": notificacion.tipo.value,
                "titulo": notificacion.titulo,
                "mensaje": notificacion.mensaje,
                "leida": notificacion.leida,
                "contador": notificacion.contador,
                "fecha_creacion": notificacion.fecha_creacion.isoformat(),
                "accion_url": notificacion.accion_url,
            }
        }

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

    async def marcar_leidas_por_referencia(
        self, 
        usuario_id: PydanticObjectId, 
        referencia_id: PydanticObjectId,
        referencia_tipo: str,
    ) -> int:
        resultado = await Notificacion.find(
            Notificacion.usuario_id == usuario_id,
            Notificacion.referencia_id == referencia_id,
            Notificacion.referencia_tipo == referencia_tipo,
            Notificacion.leida == False,
        ).update({"$set": {"leida": True}})
        
        return resultado.modified_count