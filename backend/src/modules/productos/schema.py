import re
from decimal import Decimal, InvalidOperation
from pydantic import Field, BaseModel, field_validator, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime

def generar_slug(texto: str) -> str:
    texto = texto.lower().strip()
    reemplazos = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
        'ñ': 'n',
    }
    for original, reemplazo in reemplazos.items():
        texto = texto.replace(original, reemplazo)
    texto = re.sub(r"[^a-z0-9\s]", "", texto)
    texto = re.sub(r"\s+", "-", texto).strip("-")
    return texto

class ProductoValidaciones:
    @field_validator("nombre", mode="before", check_fields=False)
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre debe tener al menos 2 caracteres")
        if len(v) > 200:
            raise ValueError("El nombre no puede superar los 200 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9À-ÿñÑ\s]+", v):
            raise ValueError("El nombre solo puede contener letras y números")
        return v.title()

    @field_validator("slug", mode="before", check_fields=False)
    @classmethod
    def validar_slug(cls, v, info):
        if v is None or (isinstance(v, str) and v.strip() == ""):
            nombre = info.data.get("nombre")
            if nombre:
                return generar_slug(nombre)
            return None
        if not isinstance(v, str):
            raise ValueError("El slug debe ser texto")
        v = v.strip().lower()
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", v):
            raise ValueError(
                "El slug solo puede contener minúsculas, números y guiones "
                "(ej: 'camiseta-algodon-premium')"
            )
        if len(v) > 220:
            raise ValueError("El slug no puede superar los 220 caracteres")
        return v

    @field_validator("descripcion", mode="before", check_fields=False)
    @classmethod
    def validar_descripcion(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripción debe ser texto")
        v = v.strip()
        if len(v) > 2000:
            raise ValueError("La descripción no puede superar los 2000 caracteres")
        return v

    @field_validator("descripcion_breve", mode="before", check_fields=False)
    @classmethod
    def validar_descripcion_breve(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La descripción breve debe ser texto")
        v = v.strip()
        if len(v) > 300:
            raise ValueError("La descripción breve no puede superar los 300 caracteres")
        return v

    @field_validator("precio", mode="before", check_fields=False)
    @classmethod
    def validar_precio(cls, v):
        if v is None:
            return None
        try:
            precio = Decimal(str(v))
        except (InvalidOperation, ValueError):
            raise ValueError("El precio debe ser un número válido")
        if precio <= 0:
            raise ValueError("El precio debe ser mayor a 0")
        return precio.quantize(Decimal("0.01"))

    @field_validator("stock", mode="before", check_fields=False)
    @classmethod
    def validar_stock(cls, v):
        if v is None:
            return 0
        try:
            stock = int(v)
        except (ValueError, TypeError):
            raise ValueError("El stock debe ser un número entero")
        if stock < 0:
            raise ValueError("El stock no puede ser negativo")
        return stock

    @field_validator("imagen", mode="before", check_fields=False)
    @classmethod
    def validar_imagen(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La imagen debe ser una URL en texto")
        v = v.strip()
        if len(v) > 500:
            raise ValueError("La URL de la imagen no puede superar los 500 caracteres")
        if not re.fullmatch(r"https?://\S+", v):
            raise ValueError("La imagen debe ser una URL válida (http o https)")
        return v

    @field_validator("categoria_id", mode="before", check_fields=False)
    @classmethod
    def validar_categoria(cls, v):
        if v is None:
            raise ValueError("La categoría es obligatoria")
        try:
            return PydanticObjectId(v)
        except Exception:
            raise ValueError("El ID de categoría no es válido")

class ProductoCreate(ProductoValidaciones, BaseModel):
    nombre: str = Field(...)
    slug: str | None = Field(default=None)
    descripcion: str | None = Field(default=None)
    descripcion_breve: str | None = Field(default=None)
    precio: Decimal = Field(...)
    stock: int = Field(default=0)
    imagen: str | None = Field(default=None)
    categoria_id: PydanticObjectId = Field(...)

class ProductoUpdate(ProductoValidaciones, BaseModel):
    nombre: str | None = Field(default=None)
    slug: str | None = Field(default=None)
    descripcion: str | None = Field(default=None)
    descripcion_breve: str | None = Field(default=None)
    precio: Decimal | None = Field(default=None)
    stock: int | None = Field(default=None)
    imagen: str | None = Field(default=None)
    categoria_id: PydanticObjectId | None = Field(default=None)

class ProductoStockUpdate(BaseModel):
    delta: int = Field(
        ...,
        description="Cantidad a sumar/restar (positivo para sumar, negativo para restar)"
    )

class ProductoPublicResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    slug: str
    descripcion_breve: str | None = None
    precio: Decimal
    stock: int
    imagen: str | None = None
    categoria_id: PydanticObjectId
    activo: bool

    model_config = ConfigDict(from_attributes=True)

class ProductoAdminResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    slug: str
    descripcion: str | None = None
    descripcion_breve: str | None = None
    precio: Decimal
    stock: int
    imagen: str | None = None
    categoria_id: PydanticObjectId
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductoResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    slug: str
    descripcion: str | None = None
    descripcion_breve: str | None = None
    precio: Decimal
    stock: int
    imagen: str | None = None
    categoria_id: PydanticObjectId
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)