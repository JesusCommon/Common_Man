from beanie import PydanticObjectId
from src.modules.mensajes.document import EstadoConversacion
from src.modules.mensajes.events import (
    message_event_bus,
    MensajeNuevoEvent,
    SolicitudNuevaEvent,
    SolicitudProcesadaEvent,
    MensajeLeidoEvent,
    MensajeEditadoEvent,
    MensajeEliminadoEvent,
    MensajeEvent,
)
from src.core.websocket.manager import manager
from src.modules.notificaciones.document import Notificacion, TipoNotificacionEnum
from src.modules.usuarios.document import Usuario


async def _nombre_usuario(user_id: str) -> str:
    try:
        usuario = await Usuario.get(PydanticObjectId(user_id))
        if not usuario:
            return "Alguien"
        nombre = f"{usuario.nombre} {usuario.apellido or ''}".strip()
        return nombre or usuario.username
    except Exception:
        return "Alguien"


async def _persistir_notificacion(
    usuario_id: str,
    tipo: TipoNotificacionEnum,
    titulo: str,
    mensaje: str,
    referencia_id: str | None = None,
    accion_url: str | None = None,
) -> None:
    try:
        await Notificacion(
            usuario_id=PydanticObjectId(usuario_id),
            tipo=tipo,
            titulo=titulo[:100],
            mensaje=mensaje[:500],
            referencia_id=PydanticObjectId(referencia_id) if referencia_id else None,
            referencia_tipo="conversacion",
            accion_url=accion_url,
        ).insert()
    except Exception as e:
        print(f"⚠️ No se pudo persistir notificación: {e}")


async def handle_mensaje_event(event: MensajeEvent) -> None:

    if isinstance(event, MensajeNuevoEvent):
        nombre = await _nombre_usuario(event.remitente_id)
        preview = event.contenido[:60]

        # WS: formato unificado { type, data }
        await manager.send_to_user(event.destinatario_id, {
            "type": "MENSAJE_NUEVO",
            "data": {
                "conversacion_id": event.conversacion_id,
                "remitente_id": event.remitente_id,
                "remitente_nombre": nombre,
                "mensaje_id": event.mensaje_id,
                "contenido": event.contenido,
                "fecha": event.fecha,
            },
        })
        await _persistir_notificacion(
            usuario_id=event.destinatario_id,
            tipo=TipoNotificacionEnum.MENSAJE,
            titulo=f"Nuevo mensaje de {nombre}",
            mensaje=preview,
            referencia_id=event.conversacion_id,
            accion_url="/mensajes",
        )

    elif isinstance(event, SolicitudNuevaEvent):
        nombre = await _nombre_usuario(event.solicitante_id)
        await manager.send_to_user(event.receptor_id, {
            "type": "SOLICITUD_NUEVA",
            "data": {
                "conversacion_id": event.conversacion_id,
                "solicitante_id": event.solicitante_id,
                "solicitante_nombre": nombre,
                "preview": event.preview,
            },
        })
        await _persistir_notificacion(
            usuario_id=event.receptor_id,
            tipo=TipoNotificacionEnum.SOLICITUD_MENSAJE,
            titulo=f"{nombre} quiere enviarte un mensaje",
            mensaje=event.preview,
            referencia_id=event.conversacion_id,
            accion_url="/mensajes/solicitudes",
        )

    elif isinstance(event, SolicitudProcesadaEvent):
        estado_txt = "aceptada" if event.estado == EstadoConversacion.ACEPTADA else "rechazada"
        await manager.send_to_user(event.notificar_a, {
            "type": "SOLICITUD_PROCESADA",
            "data": {
                "conversacion_id": event.conversacion_id,
                "estado": event.estado.value,
            },
        })
        await _persistir_notificacion(
            usuario_id=event.notificar_a,
            tipo=TipoNotificacionEnum.SOLICITUD_MENSAJE,
            titulo=f"Tu solicitud fue {estado_txt}",
            mensaje="La otra persona respondió a tu solicitud de mensaje.",
            referencia_id=event.conversacion_id,
            accion_url="/mensajes",
        )

    elif isinstance(event, MensajeLeidoEvent):
        await manager.send_to_user(event.notificar_a, {
            "type": "MENSAJE_LEIDO",
            "data": {
                "conversacion_id": event.conversacion_id,
                "leido_por": event.leido_por,
            },
        })

    elif isinstance(event, MensajeEditadoEvent):
        payload = {
            "type": "MENSAJE_EDITADO",
            "data": {
                "conversacion_id": event.conversacion_id,
                "mensaje_id": event.mensaje_id,
                "nuevo_contenido": event.nuevo_contenido,
            },
        }
        for user_id in event.participantes:
            await manager.send_to_user(user_id, payload)

    elif isinstance(event, MensajeEliminadoEvent):
        payload = {
            "type": "MENSAJE_ELIMINADO",
            "data": {
                "conversacion_id": event.conversacion_id,
                "mensaje_id": event.mensaje_id,
                "para_todos": event.para_todos,
            },
        }
        for user_id in event.participantes:
            await manager.send_to_user(user_id, payload)


def registrar_suscriptor_mensajes() -> None:
    message_event_bus.subscribe(handle_mensaje_event)