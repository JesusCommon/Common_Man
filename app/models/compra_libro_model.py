from beanie import Document, Link
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from app.models.mixins import TimestampMixim
from app.models.usuarios_model import Usuario
from app.models.libros_model import Libro

class CompraLibro(TimestampMixim, Document):
    usuario: Link[Usuario] = Field(
        ...,
        description="Usuario que realizó la compra"
    )

    libro: Link[Libro] = Field(
        ...,
        description="Libro comprado"
    )

    precio_pagado: float = Field(
        ...,
        ge=0,
        description="Precio pagado al momento de la compra (histórico, no depende del precio actual del libro)",
        examples=[50000]
    )

    class Settings:
        name = "compras_libros"
        indexes = [
            IndexModel([("usuario", ASCENDING), ("libro", ASCENDING)], unique=True),
            IndexModel([("usuario", ASCENDING)]),
            IndexModel([("libro", ASCENDING)]),
        ]