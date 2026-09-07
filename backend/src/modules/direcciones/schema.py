import re
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator
from beanie import PydanticObjectId

class DireccionValidaciones:
    @field_validator("alias", mode="before", check_fields=False)
    @classmethod
    def validar_alias(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El alias debe ser texto")
        v = v.strip()
        if len(v) < 1:
            raise ValueError("El alias no puede estar vacío")
        if len(v) > 50:
            raise ValueError("El alias no puede superar los 50 caracteres")
        return v

    @field_validator("nombre_destinatario", mode="before", check_fields=False)
    @classmethod
    def validar_nombre_destinatario(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre del destinatario debe ser texto")
        v = v.strip()
        if len(v) < 3:
            raise ValueError("El nombre del destinatario debe tener al menos 3 caracteres")
        if len(v) > 150:
            raise ValueError("El nombre del destinatario no puede superar los 150 caracteres")
        return v

    @field_validator("telefono", mode="before", check_fields=False)
    @classmethod
    def validar_telefono(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El teléfono debe ser texto")
        v = v.strip()
        if not re.fullmatch(r"[0-9+\-\s()]{7,15}", v):
            raise ValueError("El teléfono debe contener entre 7 y 15 dígitos")
        return v

    @field_validator("direccion", mode="before", check_fields=False)
    @classmethod
    def validar_direccion(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La dirección debe ser texto")
        v = v.strip()
        if len(v) < 5:
            raise ValueError("La dirección debe tener al menos 5 caracteres")
        if len(v) > 200:
            raise ValueError("La dirección no puede superar los 200 caracteres")
        return v

    @field_validator("complemento", "barrio", "referencias", mode="before", check_fields=False)
    @classmethod
    def validar_texto_opcional(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El campo debe ser texto")
        v = v.strip()
        if len(v) == 0:
            return None
        return v

    @field_validator("ciudad", "departamento", mode="before", check_fields=False)
    @classmethod
    def validar_texto_requerido(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El campo debe ser texto")
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El campo debe tener al menos 2 caracteres")
        return v

    @field_validator("codigo_postal", mode="before", check_fields=False)
    @classmethod
    def validar_codigo_postal(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El código postal debe ser texto")
        v = v.strip()
        if len(v) == 0:
            return None
        if not re.fullmatch(r"[0-9]{6}", v):
            raise ValueError("El código postal en Colombia debe tener 6 dígitos numéricos")
        return v

class DireccionCreate(DireccionValidaciones, BaseModel):
    alias: str = Field(...)
    nombre_destinatario: str = Field(...)
    telefono: str = Field(...)
    direccion: str = Field(...)
    complemento: str | None = Field(default=None)
    barrio: str | None = Field(default=None)
    ciudad: str = Field(...)
    departamento: str = Field(...)
    codigo_postal: str | None = Field(default=None)
    pais: str = Field(default="Colombia")
    referencias: str | None = Field(default=None)
    es_predeterminada: bool = Field(default=False)


class DireccionUpdate(DireccionValidaciones, BaseModel):
    alias: str | None = Field(default=None)
    nombre_destinatario: str | None = Field(default=None)
    telefono: str | None = Field(default=None)
    direccion: str | None = Field(default=None)
    complemento: str | None = Field(default=None)
    barrio: str | None = Field(default=None)
    ciudad: str | None = Field(default=None)
    departamento: str | None = Field(default=None)
    codigo_postal: str | None = Field(default=None)
    pais: str | None = Field(default=None)
    referencias: str | None = Field(default=None)


class DireccionResponse(BaseModel):
    id: PydanticObjectId
    alias: str
    nombre_destinatario: str
    telefono: str
    direccion: str
    complemento: str | None
    barrio: str | None
    ciudad: str
    departamento: str
    codigo_postal: str | None
    pais: str
    referencias: str | None
    es_predeterminada: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)


class DireccionAdminResponse(DireccionResponse):
    usuario_id: PydanticObjectId
    activo: bool

    model_config = ConfigDict(from_attributes=True)