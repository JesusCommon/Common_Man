from enum import Enum
from datetime import datetime
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from pymongo import IndexModel, ASCENDING, DESCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class EstadoEnvioEnum(str, Enum):
    PENDIENTE = "pendiente"
    PREPARANDO = "preparando"
    ENVIADO = "enviado"
    EN_TRANSITO = "en_transito"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

class EventoEnvio(BaseModel):
    estado: EstadoEnvioEnum
    descripcion: str | None = Field(
        default=None,
        max_length=500,
        description="Descripción opcional del evento"
    )
    fecha: datetime = Field(
        default_factory=datetime.utcnow,
        description="Fecha y hora del evento"
    )


class Envios(Document, StatusMixin, TimestampMixim):
    compra_id: PydanticObjectId = Field(
        ...,
        description="ID de la compra pagada asociada a este envío"
    )

    usuario_id: PydanticObjectId = Field(
        ...,
        description="ID del usuario dueño del envío (denormalizado para queries rápidas)"
    )

    direccion_id: PydanticObjectId = Field(
        ...,
        description="ID de la dirección de envío"
    )

    estado: EstadoEnvioEnum = Field(
        default=EstadoEnvioEnum.PENDIENTE,
        description="Estado actual del envío"
    )

    transportadora: str | None = Field(
        default=None,
        max_length=100,
        description="Empresa de transporte (ej: Servientrega, Coordinadora, TCC)"
    )

    numero_seguimiento: str | None = Field(
        default=None,
        max_length=100,
        description="Número de guía o tracking de la transportadora"
    )

    fecha_estimada_entrega: datetime | None = Field(
        default=None,
        description="Fecha estimada de entrega"
    )

    fecha_entrega_real: datetime | None = Field(
        default=None,
        description="Fecha real de entrega al cliente"
    )

    notas: str | None = Field(
        default=None,
        max_length=500,
        description="Notas internas o instrucciones para el envío"
    )

    eventos: list[EventoEnvio] = Field(
        default_factory=list,
        description="Historial de eventos del envío para tracking"
    )

    class Settings:
        name = "envios"
        indexes = [
            IndexModel([("compra_id", ASCENDING)], unique=True),
            IndexModel([("usuario_id", ASCENDING), ("fecha_creacion", DESCENDING)]),
            IndexModel([("estado", ASCENDING), ("fecha_creacion", DESCENDING)]),
            IndexModel([("numero_seguimiento", ASCENDING)], sparse=True),
        ]