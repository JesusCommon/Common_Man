from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from app.models.mixins import StatusMixin, TimestampMixim

class Categorias(Document, StatusMixin, TimestampMixim):
    nombre : str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Nombre de la categoría del libro",
        examples=["Ciencia Ficcion"]
    )

    descripcion : str | None = Field(
        default=None,
        max_length=500,
        description="Una breve descripcion de la categoria"
    )

    class Settings:
        name = "categorias_libro"
        indexes = [
            IndexModel([("nombre", ASCENDING)], unique=True)
        ]