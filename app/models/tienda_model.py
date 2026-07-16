from uuid import UUID, uuid4
from beanie import Document, Link
from app.models.mixins import TimestampMixim, StatusMixin
from app.models.categoria_tienda_model import CategoriaTienda
from pymongo import IndexModel, ASCENDING
from pydantic import Field, ConfigDict, HttpUrl

class ProductoTienda(Document, TimestampMixim, StatusMixin):
    model_config = ConfigDict(validate_assignment=True)

    nombre: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre del Producto",
        examples=["Pastel de Manzana"]
    )

    codigo: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Código interno del producto (SKU) para inventario",
        examples=["PROD-001"]
    )

    descripcion: str | None = Field(
        default=None,
        max_length=1000,
        description="Descripción del producto"
    )

    fotografia: HttpUrl | None = Field(
        default=None,
        description="URL de la imagen del producto"
    )

    stock: int = Field(
        default=0,
        ge=0,
        description="Cantidad de productos en stock",
        examples=[10]
    )

    identificador: UUID = Field(
        default_factory=uuid4,
        description="Identificador único de cada producto"
    )

    precio: float = Field(
        default=0,
        ge=0,
        description="Precio del producto",
        examples=[50000]
    )

    descuento: float = Field(
        default=0,
        ge=0,
        le=100,
        description="Porcentaje de descuento aplicado al producto (0-100)",
        examples=[15]
    )

    disponible: bool = Field(
        default=True,
        description="Indica si el producto puede comprarse actualmente (independiente del stock)"
    )

    categoria: Link[CategoriaTienda] = Field(
        ...,
        description="Categoría del producto"
    )

    compras: int = Field(
        default=0,
        ge=0,
        description="Cantidad de compras del producto"
    )

    class Settings:
        name = "productos"
        indexes = [
            IndexModel([("categoria", ASCENDING)]),
            IndexModel([("nombre", ASCENDING)]),
            IndexModel([("codigo", ASCENDING)], unique=True),
            IndexModel([("identificador", ASCENDING)], unique=True),
        ]