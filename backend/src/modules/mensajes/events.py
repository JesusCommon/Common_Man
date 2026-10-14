import asyncio
from typing import Callable, Awaitable
from pydantic import BaseModel
from beanie import PydanticObjectId
from src.modules.mensajes.document import EstadoConversacion

class MensajeNuevoEvent(BaseModel):
    tipo: str = "mensaje_nuevo"
    conversacion_id: str
    remitente_id: str
    destinatario_id: str
    mensaje_id: str
    contenido: str
    fecha: str

class SolicitudNuevaEvent(BaseModel):
    tipo: str = "solicitud_nueva"
    conversacion_id: str
    solicitante_id: str
    receptor_id: str
    preview: str

class SolicitudProcesadaEvent(BaseModel):
    tipo: str = "solicitud_procesada"
    conversacion_id: str
    estado: EstadoConversacion
    notificar_a: str

class MensajeLeidoEvent(BaseModel):
    tipo: str = "mensaje_leido"
    conversacion_id: str
    leido_por: str
    notificar_a: str

class MensajeEditadoEvent(BaseModel):
    tipo: str = "mensaje_editado"
    conversacion_id: str
    mensaje_id: str
    nuevo_contenido: str
    participantes: list[str]

class MensajeEliminadoEvent(BaseModel):
    tipo: str = "mensaje_eliminado"
    conversacion_id: str
    mensaje_id: str
    eliminado_por: str
    para_todos: bool
    participantes: list[str]

MensajeEvent = (
    MensajeNuevoEvent
    | SolicitudNuevaEvent
    | SolicitudProcesadaEvent
    | MensajeLeidoEvent
    | MensajeEditadoEvent
    | MensajeEliminadoEvent
)

Subscriber = Callable[[MensajeEvent], Awaitable[None]]

class MessageEventBus:
    def __init__(self):
        self._subscribers: list[Subscriber] = []

    def subscribe(self, subscriber: Subscriber) -> None:
        self._subscribers.append(subscriber)

    def unsubscribe(self, subscriber: Subscriber) -> None:
        if subscriber in self._subscribers:
            self._subscribers.remove(subscriber)

    async def publish(self, event: MensajeEvent) -> None:
        for subscriber in self._subscribers:
            try:
                await subscriber(event)
            except Exception as e:
                print(f"⚠️ Error en suscriptor de eventos: {e}")

message_event_bus = MessageEventBus()