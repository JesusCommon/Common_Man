from decimal import Decimal
from bson import Decimal128
from beanie import Document, PydanticObjectId
from pydantic import Field, field_validator
from pymongo import IndexModel, ASCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class Productos(Document, StatusMixin, TimestampMixim):
    nombre: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Nombre del producto",
        examples=["Camiseta Algodón Premium"]
    )

    slug: str = Field(
        ...,
        min_length=1,
        max_length=220,
        description="Identificador único para URLs amigables",
        examples=["camiseta-algodon-premium"]
    )

    descripcion: str | None = Field(
        default=None,
        max_length=2000,
        description="Descripción detallada del producto"
    )

    descripcion_breve: str | None = Field(
        default=None,
        max_length=300,
        description="Descripción corta para listados y tarjetas",
        examples=["Camiseta 100% algodón, corte regular"]
    )

    precio: Decimal = Field(
        ...,
        gt=0,
        description="Precio de venta del producto",
        examples=[49.99]
    )

    stock: int = Field(
        default=0,
        ge=0,
        description="Cantidad disponible en inventario",
        examples=[150]
    )

    imagen: str | None = Field(
        default=None,
        max_length=500,
        description="URL de la imagen principal del producto",
        examples=["https://cdn.midominio.com/img/camiseta.jpg"]
    )

    categoria_id: PydanticObjectId = Field(
        ...,
        description="Referencia a la categoría a la que pertenece el producto"
    )

    @field_validator("precio", mode="before")
    @classmethod
    def convertir_decimal128_a_decimal(cls, v):
        if isinstance(v, Decimal128):
            return v.to_decimal()
        return v

    class Settings:
        name = "productos"
        indexes = [
            IndexModel([("slug", ASCENDING)], unique=True),
            IndexModel([("nombre", ASCENDING)]),
            IndexModel([("categoria.id", ASCENDING)]), 
        ]