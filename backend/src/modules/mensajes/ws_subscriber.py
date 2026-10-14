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
        payload_ws = {
            "tipo": "mensaje_nuevo",
            "conversacion_id": event.conversacion_id,
            "remitente_id": event.remitente_id,
            "remitente_nombre": nombre,
            "mensaje_id": event.mensaje_id,
            "contenido": event.contenido,
            "fecha": event.fecha,
        }
        await manager.send_to_user(event.destinatario_id, payload_ws)
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
        payload_ws = {
            "tipo": "solicitud_nueva",
            "conversacion_id": event.conversacion_id,
            "solicitante_id": event.solicitante_id,
            "solicitante_nombre": nombre,
            "preview": event.preview,
        }
        await manager.send_to_user(event.receptor_id, payload_ws)
        await _persistir_notificacion(
            usuario_id=event.receptor_id,
            tipo=TipoNotificacionEnum.SOLICITUD_MENSAJE,
            titulo=f"{nombre} quiere enviarte un mensaje",
            message=event.preview,
            referencia_id=event.conversacion_id,
            accion_url="/mensajes/solicitudes",
        )

    elif isinstance(event, SolicitudProcesadaEvent):
        nombre = await _nombre_usuario(event.notificar_a)
        estado_txt = "aceptada" if event.estado == EstadoConversacion.ACEPTADA else "rechazada"
        payload_ws = {
            "tipo": "solicitud_procesada",
            "conversacion_id": event.conversacion_id,
            "estado": event.estado.value,
        }
        await manager.send_to_user(event.notificar_a, payload_ws)
        await _persistir_notificacion(
            usuario_id=event.notificar_a,
            tipo=TipoNotificacionEnum.SOLICITUD_MENSAJE,
            titulo=f"Tu solicitud fue {estado_txt}",
            mensaje="La otra persona respondió a tu solicitud de mensaje.",
            referencia_id=event.conversacion_id,
            accion_url="/mensajes",
        )

    elif isinstance(event, MensajeLeidoEvent):
        payload_ws = {
            "tipo": "mensaje_leido",
            "conversacion_id": event.conversacion_id,
            "leido_por": event.leido_por,
        }
        await manager.send_to_user(event.notificar_a, payload_ws)

    elif isinstance(event, MensajeEditadoEvent):
        payload_ws = {
            "tipo": "mensaje_editado",
            "conversacion_id": event.conversacion_id,
            "mensaje_id": event.mensaje_id,
            "nuevo_contenido": event.nuevo_contenido,
        }
        for user_id in event.participantes:
            await manager.send_to_user(user_id, payload_ws)

    elif isinstance(event, MensajeEliminadoEvent):
        payload_ws = {
            "tipo": "mensaje_eliminado",
            "conversacion_id": event.conversacion_id,
            "mensaje_id": event.mensaje_id,
            "para_todos": event.para_todos,
        }
        for user_id in event.participantes:
            await manager.send_to_user(user_id, payload_ws)

def registrar_suscriptor_mensajes() -> None:
    message_event_bus.subscribe(handle_mensaje_event)