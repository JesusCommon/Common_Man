from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator
from beanie import PydanticObjectId
from src.modules.envios.document import EstadoEnvioEnum, EventoEnvio

class EnvioValidaciones:
    @field_validator("transportadora", mode="before", check_fields=False)
    @classmethod
    def validar_transportadora(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La transportadora debe ser texto")
        v = v.strip()
        if len(v) == 0:
            return None
        if len(v) > 100:
            raise ValueError("La transportadora no puede superar los 100 caracteres")
        return v

    @field_validator("numero_seguimiento", mode="before", check_fields=False)
    @classmethod
    def validar_numero_seguimiento(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El número de seguimiento debe ser texto")
        v = v.strip()
        if len(v) == 0:
            return None
        if len(v) > 100:
            raise ValueError("El número de seguimiento no puede superar los 100 caracteres")
        return v

    @field_validator("notas", mode="before", check_fields=False)
    @classmethod
    def validar_notas(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("Las notas deben ser texto")
        v = v.strip()
        if len(v) == 0:
            return None
        if len(v) > 500:
            raise ValueError("Las notas no pueden superar los 500 caracteres")
        return v

class EnvioCreate(BaseModel):
    compra_id: PydanticObjectId
    direccion_id: PydanticObjectId
    notas: str | None = Field(default=None, max_length=500)


class EnvioUpdate(BaseModel):
    transportadora: str | None = Field(default=None, max_length=100)
    numero_seguimiento: str | None = Field(default=None, max_length=100)
    fecha_estimada_entrega: datetime | None = None
    notas: str | None = Field(default=None, max_length=500)


class EnvioEstadoUpdate(BaseModel):
    estado: EstadoEnvioEnum
    descripcion: str | None = Field(
        default=None,
        max_length=500,
        description="Descripción opcional del cambio de estado"
    )

class EventoEnvioResponse(BaseModel):
    estado: EstadoEnvioEnum
    descripcion: str | None
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)


class EnvioResponse(BaseModel):
    id: PydanticObjectId
    compra_id: PydanticObjectId
    direccion_id: PydanticObjectId
    estado: EstadoEnvioEnum
    transportadora: str | None
    numero_seguimiento: str | None
    fecha_estimada_entrega: datetime | None
    fecha_entrega_real: datetime | None
    notas: str | None
    eventos: list[EventoEnvioResponse]
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)


class EnvioAdminResponse(EnvioResponse):
    usuario_id: PydanticObjectId
    activo: bool

    model_config = ConfigDict(from_attributes=True)


class EnvioDetalleResponse(BaseModel):
    envio: EnvioResponse
    compra_numero_orden: str | None = None
    direccion_alias: str | None = None
    direccion_completa: str | None = None

    model_config = ConfigDict(from_attributes=True)