from enum import Enum
from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel, ASCENDING, DESCENDING
from src.shared.mixins import TimestampMixim

class TipoNotificacionEnum(str, Enum):
    SISTEMA = "sistema"
    COMPRA = "compra"
    ENVIO = "envio"
    SALDO = "saldo"
    SOPORTE = "soporte"
    PROMOCION = "promocion"
    FOLLOW = "seguidores"  # ✅ Agregado

class Notificacion(Document, TimestampMixim):
    usuario_id: PydanticObjectId = Field(
        ..., 
        description="ID del usuario destinatario"
    )
    
    tipo: TipoNotificacionEnum = Field(
        ..., 
        description="Categoría de la notificación"
    )
    
    titulo: str = Field(
        ..., 
        max_length=100, 
        description="Título corto de la notificación"
    )
    
    mensaje: str = Field(
        ..., 
        max_length=500, 
        description="Cuerpo del mensaje"
    )
    
    leida: bool = Field(
        default=False, 
        description="Indica si el usuario ya vio la notificación"
    )
    
    referencia_id: PydanticObjectId | None = Field(
        default=None, 
        description="ID de la entidad relacionada (ej: ID de la compra)"
    )
    
    referencia_tipo: str | None = Field(
        default=None, 
        max_length=50, 
        description="Tipo de entidad relacionada (ej: 'compra', 'envio')"
    )
    
    accion_url: str | None = Field(
        default=None, 
        max_length=200, 
        description="Ruta frontend para navegar al hacer click"
    )

    class Settings:
        name = "notificaciones"
        indexes = [
            # Índice compuesto para listar historial de un usuario ordenado por fecha
            IndexModel([("usuario_id", ASCENDING), ("fecha_creacion", DESCENDING)]),
            # Índice compuesto para contar/obtener no leídas rápidamente
            IndexModel([("usuario_id", ASCENDING), ("leida", ASCENDING)]),
        ]