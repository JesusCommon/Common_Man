import re
import unicodedata
from pydantic import Field, BaseModel, field_validator, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime

class EditorialValidaciones:
    @field_validator("nombre", mode="before", check_fields=False)
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")
        v = v.strip()
        if len(v) < 2 and len(v) > 150:
            raise ValueError("El nombre tiene que tener al menos 1 caracteres o Menos de 150 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9À-ÿñÑ\s]+", v):
            raise ValueError("El nombre solo puede llevar letras y numeros")
        return v.title()

    @field_validator("descripcion", mode="before", check_fields=False)
    @classmethod
    def validar_descripcion(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripcion debe ser texto")
        v = v.strip()
        if len(v) > 1000:
            raise ValueError("La descripcion no puede tener más de 1000 caracteres")
        return v

class EditorialCreate(EditorialValidaciones, BaseModel):
    nombre: str = Field(...)
    descripcion : str | None = Field(default=None)

class EditorialUpdate(EditorialValidaciones, BaseModel):
    nombre: str | None = Field(default=None)
    descripcion : str | None = Field(default=None)

class EditorialResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    descripcion: str | None = None
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)

def generar_slug(texto: str) -> str:
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    texto = texto.lower().strip()
    texto = re.sub(r"[^a-z0-9\s-]", "", texto)
    texto = re.sub(r"[\s_-]+", "-", texto).strip("-")
    return texto

class EditorialPublicResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    slug: str

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_editorial(cls, editorial) -> "EditorialPublicResponse":
        return cls(
            id=editorial.id,
            nombre=editorial.nombre,
            slug=generar_slug(editorial.nombre),
        )