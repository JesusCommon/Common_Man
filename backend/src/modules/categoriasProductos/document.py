from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class Categorias(Document, StatusMixin, TimestampMixim):
    nombre : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre de la categoria que tendrá el producto",
        examples=["Tecnología"]
    )

    descripcion : str | None = Field(
        default=None,
        max_length=500,
        description="Breve descripcion de la categoria"
    )

    class Settings:
        name = "categoriasProductos"
        indexes = [
            IndexModel([("nombre", ASCENDING)], unique=True)
        ]