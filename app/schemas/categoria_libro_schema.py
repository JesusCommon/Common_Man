import re
from pydantic import field_validator, BaseModel, Field, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime

class CategoriasValidacion:
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre tiene que tener al menos 2 caracteres")
        if not re.fullmatch(r"[A-Za-zÀ-ÿñÑ\s]+", v):
            raise ValueError("El nombre solo puede llevar letras")
        return v.title()

    @field_validator("descripcion", mode="before")
    @classmethod
    def validar_bio(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripcion debe ser texto")
        v = v.strip()
        if len(v) > 40:
            raise ValueError("La descripcion no puede tener más de 500 caracteres")
        return v
    
class CategoriaCreate(BaseModel, CategoriasValidacion):
    nombre : str = Field(...)
    descripcion : str | None = Field(default=None)

class CategoriaUpdate(BaseModel, CategoriasValidacion):
    nombre : str | None = Field(default=None)
    descripcion : str | None = Field(default=None)

class CategoriasResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    descripcion: str | None = None
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)
