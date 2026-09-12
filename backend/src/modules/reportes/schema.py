from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from beanie import PydanticObjectId
from src.modules.reportes.document import (
    EstadoReporteEnum,
    CategoriaReporteEnum,
    RolMensajeEnum,
)

class ReporteCreate(BaseModel):
    categoria: CategoriaReporteEnum
    asunto: str = Field(..., min_length=3, max_length=200)
    descripcion: str = Field(..., min_length=10, max_length=5000)
    codigo_referencia: str | None = Field(default=None, max_length=50)

    @field_validator("asunto", "descripcion", mode="before")
    @classmethod
    def limpiar_texto(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v


class MensajeCreate(BaseModel):
    contenido: str = Field(..., min_length=1, max_length=5000)

    @field_validator("contenido", mode="before")
    @classmethod
    def limpiar_texto(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v


class ReporteEstadoUpdate(BaseModel):
    estado: EstadoReporteEnum
    mensaje_resolucion: str | None = Field(
        default=None,
        max_length=2000,
        description="Mensaje final del admin al resolver/cerrar"
    )

class MensajeResponse(BaseModel):
    usuario_id: PydanticObjectId
    nombre_usuario: str
    rol: RolMensajeEnum
    contenido: str
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)

class ReporteResponse(BaseModel):
    id: PydanticObjectId
    categoria: CategoriaReporteEnum
    estado: EstadoReporteEnum
    asunto: str
    descripcion: str
    codigo_referencia: str | None
    mensajes: list[MensajeResponse]
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    fecha_cierre: datetime | None

    model_config = ConfigDict(from_attributes=True)

class ReporteAdminResponse(ReporteResponse):
    usuario_id: PydanticObjectId

    model_config = ConfigDict(from_attributes=True)