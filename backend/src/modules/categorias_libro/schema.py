import re
from pydantic import field_validator, BaseModel, Field, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime

class CategoriaValidacion:
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre de la categoria debe ser texto")
        v = v.strip()
        if len(v) < 1 or len(v) > 150:
            raise ValueError("El nombre de la categoria debe tener entre 1 a 150 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9Á-ÿñÑ\s]+", v):
            raise ValueError("Nombre con caracteres invalidos")
        return v.title()

    @field_validator("descripcion", mode="before")
    @classmethod
    def validar_descripcion(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripción debe ser texto")
        v = v.strip()
        if len(v) > 1000:
            raise ValueError("La descripción no puede tener más de 1000 caracteres")
        if "<" in v or ">" in v:
            raise ValueError("La descripción contiene caracteres inválidos")
        return v

class CategoriaLibroCreate(BaseModel, CategoriaValidacion):
    nombre : str = Field(...)
    descripcion : str | None = Field(default=None)

class CategoriaLibroUpdate(BaseModel, CategoriaValidacion):
    nombre : str | None = Field(default=None)
    descripcion : str | None = Field(default=None)

class CategoriaLibroResponse(BaseModel):
    id: PydanticObjectId
    nombre : str
    descripcion : str | None = None
    activo : bool
    fecha_creacion : datetime
    fecha_actualizacion : datetime

    model_config = ConfigDict(from_attributes=True)
