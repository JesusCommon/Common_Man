from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from beanie import PydanticObjectId
from src.modules.notificaciones.document import TipoNotificacionEnum

class NotificacionCreate(BaseModel):
    usuario_id: PydanticObjectId | None = Field(
        default=None, 
        description="Si es None, se asume broadcast (para todos los usuarios)"
    )
    tipo: TipoNotificacionEnum
    titulo: str = Field(..., max_length=100)
    mensaje: str = Field(..., max_length=500)
    referencia_id: PydanticObjectId | None = None
    referencia_tipo: str | None = Field(default=None, max_length=50)
    accion_url: str | None = Field(default=None, max_length=200)

class NotificacionUpdate(BaseModel):
    leida: bool

class NotificacionResponse(BaseModel):
    id: PydanticObjectId
    tipo: TipoNotificacionEnum
    titulo: str
    mensaje: str
    leida: bool
    referencia_id: PydanticObjectId | None
    referencia_tipo: str | None
    accion_url: str | None
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)

class NotificacionAdminResponse(NotificacionResponse):
    usuario_id: PydanticObjectId
    model_config = ConfigDict(from_attributes=True)