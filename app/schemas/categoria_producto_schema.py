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
            raise ValueError("El nombre debe ser texto")
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre de la categoria debe tener al menos 2 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9À-ÿñÑ\s]+", v):
            raise ValueError("El nombre de la categoria solo puede llevar letras o numeros")
        return v.title()

    @field_validator("descripcion", mode="before")
    @classmethod
    def validar_bio(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripcion debe ser texto")
        v = v.strip()
        if len(v) > 1000:
            raise ValueError("La descripcion no puede tener más de 1000 caracteres")
        return v
    
class CategoriaCreate(BaseModel, CategoriaValidacion):
    nombre : str = Field(...)
    descripcion : str | None = Field(default=None)

class CategoriaUpdate(BaseModel, CategoriaValidacion):
    nombre : str | None = Field(default=None)
    descripcion : str | None = Field(default=None)

class CategoriaResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    descripcion: str | None = None
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)
