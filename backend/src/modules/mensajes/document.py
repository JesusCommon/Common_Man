from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel, ASCENDING, DESCENDING
from datetime import datetime
from enum import Enum
from src.shared.mixins import TimestampMixim

class EstadoConversacion(str, Enum):
    PENDIENTE = "pendiente"
    ACEPTADA = "aceptada"
    RECHAZADA = "rechazada"

class TipoMensaje(str, Enum):
    TEXTO = "texto"

class Conversacion(Document, TimestampMixim):
    clave: str = Field(
        ...,
        description="IDs de participantes ordenados y unidos (único por pareja)",
    )
    participantes: list[PydanticObjectId] = Field(
        ...,
        min_length=2,
        max_length=2,
        description="Los dos usuarios de la conversación",
    )
    solicitante_id: PydanticObjectId = Field(
        ...,
        description="Usuario que inició la conversación",
    )
    estado: EstadoConversacion = Field(
        default=EstadoConversacion.PENDIENTE,
        description="pendiente (solicitud), aceptada o rechazada",
    )

    ultimo_mensaje_id: PydanticObjectId | None = Field(default=None)
    ultimo_contenido: str | None = Field(default=None)
    ultimo_remitente_id: PydanticObjectId | None = Field(default=None)
    ultimo_fecha: datetime | None = Field(default=None)

    no_leidos: dict[str, int] = Field(
        default_factory=dict,
        description="Contador de no leídos por usuario",
    )
    oculta_para: list[PydanticObjectId] = Field(
        default_factory=list,
        description="Usuarios que ocultaron la conversación solo para sí",
    )

    class Settings:
        name = "conversaciones"
        indexes = [
            IndexModel([("clave", ASCENDING)], unique=True),
            IndexModel([("participantes", ASCENDING), ("ultimo_fecha", DESCENDING)]),
            IndexModel([("estado", ASCENDING)]),
        ]


class Mensaje(Document, TimestampMixim):
    conversacion_id: PydanticObjectId = Field(
        ...,
        description="Conversación a la que pertenece",
    )
    remitente_id: PydanticObjectId = Field(
        ...,
        description="Usuario que envió el mensaje",
    )
    contenido: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Texto del mensaje",
    )
    tipo: TipoMensaje = Field(
        default=TipoMensaje.TEXTO,
        description="Tipo de mensaje (beta: solo texto)",
    )

    leido: bool = Field(default=False)
    editado: bool = Field(default=False)
    fecha_edicion: datetime | None = Field(default=None)

    eliminado: bool = Field(
        default=False,
        description="Eliminado para todos (placeholder)",
    )
    eliminado_para: list[PydanticObjectId] = Field(
        default_factory=list,
        description="Usuarios para quienes el mensaje está oculto",
    )

    class Settings:
        name = "mensajes"
        indexes = [
            IndexModel([("conversacion_id", ASCENDING), ("fecha_creacion", ASCENDING)]),
            IndexModel([("remitente_id", ASCENDING)]),
        ]