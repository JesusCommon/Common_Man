import re
import unicodedata
from pydantic import Field, BaseModel, field_validator, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime

class AutorValidaciones:
    @field_validator("nombre", mode="before", check_fields=False)
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")
        v = v.strip()
        if len(v) < 2 or len(v) > 150:
            raise ValueError("El nombre debe tener entre 2 y 150 caracteres")
        if not re.fullmatch(r"[A-Za-zÀ-ÿñÑ\s]+", v):
            raise ValueError("El nombre solo puede llevar letras")
        return v.title()

    @field_validator("apellido", mode="before", check_fields=False)
    @classmethod
    def validar_apellido(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El apellido debe ser texto")
        v = v.strip()
        if len(v) < 2 or len(v) > 150:
            raise ValueError("El apellido debe tener entre 2 y 150 caracteres")
        if not re.fullmatch(r"[A-Za-zÀ-ÿñÑ\s]+", v):
            raise ValueError("El apellido solo puede llevar letras")
        return v.title()

    @field_validator("pais_nacimiento", mode="before", check_fields=False)
    @classmethod
    def validar_pais(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El país de nacimiento debe ser texto")
        v = v.strip()
        if len(v) < 2 or len(v) > 50:
            raise ValueError("El país debe tener entre 2 y 50 caracteres")
        if not re.fullmatch(r"[A-Za-zÀ-ÿñÑ\s]+", v):
            raise ValueError("El país solo puede llevar letras")
        return v.title()


class AutorCreate(AutorValidaciones, BaseModel):
    nombre: str = Field(...)
    apellido: str = Field(...)
    pais_nacimiento: str | None = Field(default=None)


class AutorUpdate(AutorValidaciones, BaseModel):
    nombre: str | None = Field(default=None)
    apellido: str | None = Field(default=None)
    pais_nacimiento: str | None = Field(default=None)


class AutorResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    apellido: str
    pais_nacimiento: str | None = None
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


class AutorPublicResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    apellido: str
    pais_nacimiento: str | None = None
    slug: str

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_autor(cls, autor) -> "AutorPublicResponse":
        return cls(
            id=autor.id,
            nombre=autor.nombre,
            apellido=autor.apellido,
            pais_nacimiento=autor.pais_nacimiento,
            slug=generar_slug(f"{autor.nombre} {autor.apellido or ''}"),
        )