import re
from datetime import datetime
from decimal import Decimal
from pydantic import field_validator, BaseModel, Field, HttpUrl, ConfigDict
from beanie import PydanticObjectId
from src.modules.biblioteca.libros.document import Idiomas

class LibroValidaciones:
    @field_validator("nombre", mode="before", check_fields=False)
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")
        v = " ".join(v.split())
        if len(v) < 1:
            raise ValueError("El nombre es obligatorio")
        if len(v) > 150:
            raise ValueError("El nombre no puede tener más de 150 caracteres")
        return v

    @field_validator("edicion", mode="before", check_fields=False)
    @classmethod
    def validar_edicion(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La edición debe ser texto")
        v = v.strip()
        if not v:
            return None
        if len(v) > 100:
            raise ValueError("La edición no puede tener más de 100 caracteres")
        return v

    @field_validator("isbn", mode="before", check_fields=False)
    @classmethod
    def validar_isbn(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El ISBN debe ser texto")
        v = re.sub(r"[-\s]", "", v.strip()).upper()
        if not v:
            return None
        if not re.fullmatch(r"[0-9]{9}[0-9X]|[0-9]{13}", v):
            raise ValueError("ISBN inválido: debe ser ISBN-10 o ISBN-13")
        return v

    @field_validator("sku", mode="before", check_fields=False)
    @classmethod
    def validar_sku(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El SKU debe ser texto")
        v = v.strip().upper()
        if not v:
            return None
        if not re.fullmatch(r"[A-Z0-9\-_.]{3,50}", v):
            raise ValueError(
                "SKU inválido: solo letras, números, guiones, puntos o guiones bajos (3 a 50)"
            )
        return v

    @field_validator("descripcion", mode="before", check_fields=False)
    @classmethod
    def validar_descripcion(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripción debe ser texto")
        v = v.strip()
        if not v:
            return None
        if len(v) > 1000:
            raise ValueError("La descripción no puede tener más de 1000 caracteres")
        return v

    @field_validator("portada", mode="before", check_fields=False)
    @classmethod
    def validar_portada(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La portada debe ser una URL")
        v = v.strip()
        return v or None

    @field_validator("precio", mode="before", check_fields=False)
    @classmethod
    def validar_precio(cls, v):
        if v is None:
            return None
        try:
            precio = Decimal(str(v)).quantize(Decimal("0.01"))
        except Exception:
            raise ValueError("El precio debe ser un número válido")
        if precio <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        return precio

    @field_validator("stock", mode="before", check_fields=False)
    @classmethod
    def validar_stock(cls, v):
        if v is None:
            return None
        if isinstance(v, bool) or not isinstance(v, int):
            raise ValueError("El stock debe ser un número entero")
        if v < 0:
            raise ValueError("El stock no puede ser negativo")
        return v

    @field_validator("paginas", mode="before", check_fields=False)
    @classmethod
    def validar_paginas(cls, v):
        if v is None:
            return None
        if isinstance(v, bool) or not isinstance(v, int):
            raise ValueError("Las páginas deben ser un número entero")
        if v < 1:
            raise ValueError("El libro debe tener al menos 1 página")
        return v

    @field_validator("anio_publicacion", mode="before", check_fields=False)
    @classmethod
    def validar_anio(cls, v):
        if v is None:
            return None
        if isinstance(v, bool) or not isinstance(v, int):
            raise ValueError("El año debe ser un número entero")
        if v < 1000 or v > 2100:
            raise ValueError("El año de publicación debe estar entre 1000 y 2100")
        return v

class LibroCreate(LibroValidaciones, BaseModel):
    nombre: str = Field(...)
    autor_id: PydanticObjectId = Field(...)
    editorial_id: PydanticObjectId = Field(...)
    genero_id: PydanticObjectId = Field(...)
    edicion: str | None = Field(default=None)
    anio_publicacion: int = Field(...)
    paginas: int = Field(...)
    idioma: Idiomas = Field(default=Idiomas.ESPANOL)
    portada: str | None = Field(default=None)
    isbn: str | None = Field(default=None)
    sku: str | None = Field(default=None)
    precio: Decimal = Field(...)
    stock: int = Field(default=0)
    descripcion: str | None = Field(default=None)
    contenido: HttpUrl = Field(...)

class LibroUpdate(LibroValidaciones, BaseModel):
    nombre: str | None = Field(default=None)
    autor_id: PydanticObjectId | None = Field(default=None)
    editorial_id: PydanticObjectId | None = Field(default=None)
    genero_id: PydanticObjectId | None = Field(default=None)
    edicion: str | None = Field(default=None)
    anio_publicacion: int | None = Field(default=None)
    paginas: int | None = Field(default=None)
    idioma: Idiomas | None = Field(default=None)
    portada: str | None = Field(default=None)
    isbn: str | None = Field(default=None)
    sku: str | None = Field(default=None)
    precio: Decimal | None = Field(default=None)
    stock: int | None = Field(default=None)
    descripcion: str | None = Field(default=None)
    contenido: HttpUrl | None = Field(default=None)
    activo: bool | None = Field(default=None)

class LibroResponse(BaseModel):
    """Vista pública de catálogo. ⚠️ SIN contenido: se libera solo tras la compra"""
    id: PydanticObjectId
    nombre: str
    autor_id: PydanticObjectId
    editorial_id: PydanticObjectId
    genero_id: PydanticObjectId
    edicion: str | None = None
    anio_publicacion: int
    paginas: int
    idioma: Idiomas
    portada: str | None = None
    isbn: str | None = None
    sku: str | None = None
    precio: Decimal
    stock: int
    descripcion: str | None = None
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)


class LibroAdminResponse(LibroResponse):
    contenido: HttpUrl

    model_config = ConfigDict(from_attributes=True)


class LibroContenidoResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    contenido: HttpUrl

    model_config = ConfigDict(from_attributes=True)