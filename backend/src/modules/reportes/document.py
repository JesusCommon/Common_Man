from enum import Enum
from datetime import datetime, timezone
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from pymongo import IndexModel, ASCENDING, DESCENDING
from src.shared.mixins import TimestampMixim

class EstadoReporteEnum(str, Enum):
    ABIERTO = "abierto"
    EN_PROGRESO = "en_progreso"
    RESUELTO = "resuelto"
    CERRADO = "cerrado"

class CategoriaReporteEnum(str, Enum):
    COMPRA = "compra"
    PRODUCTO = "producto"
    PAGO = "pago"
    ENVIO = "envio"
    CUENTA = "cuenta"
    OTRO = "otro"

class RolMensajeEnum(str, Enum):
    USUARIO = "usuario"
    ADMIN = "admin"

class MensajeReporte(BaseModel):
    usuario_id: PydanticObjectId = Field(
        ...,
        description="ID del usuario o admin que envió el mensaje"
    )
    nombre_usuario: str = Field(
        ...,
        max_length=150,
        description="Nombre de quien envió el mensaje (para display)"
    )
    rol: RolMensajeEnum = Field(
        ...,
        description="Rol de quien envió el mensaje"
    )
    contenido: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Contenido del mensaje"
    )
    fecha: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Fecha y hora del mensaje"
    )


class Reporte(Document, TimestampMixim):
    usuario_id: PydanticObjectId = Field(
        ...,
        description="ID del usuario que abrió el reporte"
    )

    categoria: CategoriaReporteEnum = Field(
        ...,
        description="Categoría del reporte"
    )

    estado: EstadoReporteEnum = Field(
        default=EstadoReporteEnum.ABIERTO,
        description="Estado actual del reporte"
    )

    asunto: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Título breve del reporte"
    )

    descripcion: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Descripción detallada del problema o consulta"
    )

    codigo_referencia: str | None = Field(
        default=None,
        max_length=50,
        description="Código de referencia manual (ej: número de orden, ID de producto)"
    )

    mensajes: list[MensajeReporte] = Field(
        default_factory=list,
        description="Historial de mensajes entre usuario y admin"
    )

    fecha_cierre: datetime | None = Field(
        default=None,
        description="Fecha en que se resolvió o cerró el reporte"
    )

    @property
    def total_mensajes(self) -> int:
        return len(self.mensajes)

    @property
    def ultimo_mensaje(self) -> MensajeReporte | None:
        return self.mensajes[-1] if self.mensajes else None

    class Settings:
        name = "reportes"
        indexes = [
            IndexModel([("usuario_id", ASCENDING), ("fecha_creacion", DESCENDING)]),
            IndexModel([("estado", ASCENDING), ("fecha_creacion", DESCENDING)]),
            IndexModel([("categoria", ASCENDING)]),
        ]