import re
from pydantic import Field, field_validator, BaseModel, HttpUrl, ConfigDict
from datetime import datetime
from uuid import UUID
from beanie import PydanticObjectId, Link

class TiendaValidacion:
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")  
        v = v.strip()
        if len(v) < 1 or len(v) > 150:
            raise ValueError("El nombre del producto debe tener entre 1 a 150 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9Á-ÿñÑ\s]+", v):
            raise ValueError("El nombre del Producto solo debe contener letras y/o numeros")
        return v.title()
    
    @field_validator("codigo", mode="before")
    @classmethod
    def validar_codigo(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El codigo debe ser texto")
        v = v.strip()
        if len(v) < 3 or len(v) > 50:
            raise ValueError("El codigo debe tener entre 3 a 50 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9_-]+", v):
            raise ValueError("El codigo solo puede llevar letras, numero o guiones")
        return v.upper()
    
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
    
    @field_validator("descuento", mode="before")
    @classmethod
    def validar_descuento(cls, v):
        if v is None:
            return None
        if not isinstance(v, (int, float)):
            raise ValueError("El descuento debe ser un número")
        if v < 0 or v > 100:
            raise ValueError("El descuento debe estar entre 0 y 100")
        return v
    
    @field_validator("disponible", mode="before")
    @classmethod
    def validar_disponible(cls, v):
        if v is None:
            return None
        if not isinstance(v, bool):
            raise ValueError("Disponible debe ser verdadero o falso")
        return v
    
    @field_validator("fotografia", mode="before")
    @classmethod
    def validar_fotografia(cls, v):
        if v is None:
            return None
        url = str(v)
        if not url.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            raise ValueError("La fotografía debe ser una URL con extensión .jpg, .jpeg, .png o .webp")
        return v

class TiendaCreate(TiendaValidacion, BaseModel):
    nombre : str = Field(...)
    codigo : str = Field(...)
    descripcion : str | None = Field(default=None)
    fotografia : HttpUrl | None = Field(default=None)
    stock : int = Field(...)
    precio : float = Field(...)
    descuento: float | None = Field(default=None, ge=0, le=100)
    disponible : bool = Field(default=True)
    categoria : PydanticObjectId = Field(...)

class TiendaUpdate(TiendaValidacion, BaseModel):
    nombre : str | None = Field(default=None)
    codigo : str | None = Field(default=None)
    descripcion : str | None = Field(default=None)
    fotografia : HttpUrl | None = Field(default=None)
    stock : int | None = Field(default=None)
    precio : float | None = Field(default=None)
    descuento: float | None = Field(default=None, ge=0, le=100)
    disponible : bool | None = Field(default=None)
    categoria : PydanticObjectId | None = Field(default=None)


class TiendaResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    codigo : str
    descripcion: str | None = None
    fotografia : HttpUrl | None = None
    stock: int
    identificador : UUID
    precio: float
    categoria: PydanticObjectId
    descuento : float
    disponible : bool
    compras : int
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    @field_validator("categoria", mode="before")
    @classmethod
    def extraer_id_categoria(cls, v):
        if isinstance(v, Link):
            return v.ref.id
        return v

    model_config = ConfigDict(from_attributes=True)