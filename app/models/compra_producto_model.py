from beanie import Document, Link
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from app.models.mixins import TimestampMixim
from app.models.usuarios_model import Usuario
from app.models.productos_model import Producto

class CompraProducto(TimestampMixim, Document):
    usuario: Link[Usuario] = Field(
        ...,
        description="Usuario que realizó la compra"
    )

    producto: Link[Producto] = Field(
        ...,
        description="Producto comprado"
    )

    cantidad: int = Field(
        ...,
        ge=1,
        description="Cantidad de unidades compradas",
        examples=[2]
    )

    precio_unitario: float = Field(
        ...,
        ge=0,
        description="Precio unitario pagado al momento de la compra (histórico)",
        examples=[25000]
    )

    precio_total: float = Field(
        ...,
        ge=0,
        description="Precio total pagado (precio_unitario * cantidad, ya con descuento aplicado si hubo)",
        examples=[50000]
    )

    class Settings:
        name = "compras_productos"
        indexes = [
            IndexModel([("usuario", ASCENDING)]),
            IndexModel([("producto", ASCENDING)]),
        ]