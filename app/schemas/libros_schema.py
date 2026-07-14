import re
from pydantic import Field, field_validator, BaseModel, HttpUrl, ConfigDict
from datetime import datetime
from app.models.libros_model import Idioma
from beanie import PydanticObjectId, Link

class LibrosValidaciones:
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")  
        v = v.strip()
        if len(v) < 1 or len(v) > 150:
            raise ValueError("El nombre del libro debe tener entre 1 a 150 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9Á-ÿñÑ\s]+", v):
            raise ValueError("El nombre solo debe contener letras y numeros")
        return v.title()
    
    @field_validator("autor", mode="before")
    @classmethod
    def validar_autor(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El autor debe incluir texto")
        v = v.strip()
        if len(v) < 3 or len(v) > 150:
            raise ValueError("El autor debe incluir entre 3 a 150 caracteres")
        if not re.fullmatch(r"[A-Za-zÁ-ÿñÑ\s]+", v):
            raise ValueError("El autor solo debe contener letras")
        return v.title()
    
    @field_validator("descripcion", mode="before")
    @classmethod
    def validar_descripcion(cls, v):
        if v is None: 
            return None
        if not isinstance(v, str):
            raise ValueError("La descripcion debe contener texto")
        v = v.strip()
        if len(v) > 1000:
            raise ValueError("La descripcion no debe contener más de 1000 caracteres")
        return v

    @field_validator("anio_publicacion", mode="before")
    @classmethod
    def validar_anio_publicacion(cls, v):
        if v is None:
            return None
        if not isinstance(v, int):
            raise ValueError("El año de publicación debe ser un número entero")
        anio_actual = datetime.now().year
        if v < 1000 or v > anio_actual:
            raise ValueError(f"El año de publicación debe estar entre 1000 y {anio_actual}")
        return v
    
    @field_validator("editorial", mode="before")
    @classmethod
    def validar_editorial(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La editorial debe ser texto")
        v = v.strip()
        if len(v) < 2 or len(v) > 150:
            raise ValueError("La editorial debe tener entre 2 y 150 caracteres")
        return v.title()
    
    @field_validator("precio", mode="before")
    @classmethod
    def validar_precio(cls, v):
        if v is None:
            return None
        if not isinstance(v, (int, float)):
            raise ValueError("El precio debe ser un número")
        if v < 0:
            raise ValueError("El precio no puede ser negativo")
        return v
    
    @field_validator("stock", mode="before")
    @classmethod
    def validar_stock(cls, v):
        if v is None:
            return None
        if not isinstance(v, int):
            raise ValueError("El stock debe ser un número entero")
        if v < 0:
            raise ValueError("El stock no puede ser negativo")
        return v
    
class LibroCreate(LibrosValidaciones, BaseModel):
    nombre : str = Field(...)
    autor : str = Field(...)
    descripcion : str | None = Field(default=None)
    anio_publicacion : int = Field(...)
    portada : HttpUrl | None = Field(None)
    editorial : str | None = Field(default=None)
    idioma: Idioma = Field(default=Idioma.ESPANOL)
    stock : int = Field(...)
    precio : float = Field(...)
    categoria: PydanticObjectId = Field(...)
    contenido : HttpUrl = Field(...)

class LibroUpdate(LibrosValidaciones, BaseModel):
    nombre : str | None = Field(default=None)
    autor : str | None = Field(default=None)
    descripcion : str | None = Field(default=None)
    anio_publicacion : int | None = Field(default=None)
    portada : HttpUrl | None = Field(None)
    editorial : str | None = Field(default=None)
    idioma: Idioma | None = Field(default=None)
    stock : int | None = Field(default=None)
    precio : float | None = Field(default=None)
    categoria: PydanticObjectId | None = Field(default=None)
    contenido : HttpUrl | None = Field(default=None)

class LibroResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    autor: str
    descripcion: str | None = None
    anio_publicacion: int
    portada: HttpUrl | None = None
    editorial: str | None = None
    idioma: Idioma
    stock: int
    precio: float
    categoria: PydanticObjectId
    descargas: int
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    @field_validator("categoria", mode="before")
    @classmethod
    def extraer_id_categoria(cls, v):
        if isinstance(v, Link):
            return v.ref.id  # el Link guarda la referencia con su id aquí
        return v  # si ya es un PydanticObjectId u otra cosa, lo deja pasar

    model_config = ConfigDict(from_attributes=True)
