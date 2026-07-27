from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class CategoriaLibro(Document, TimestampMixim, StatusMixin):
    nombre : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre de la categoria del libro",
        examples=["Terror"]
    )

    descripcion : str | None = Field(
        default=None,
        max_length=1000,
        description="Decripcion de la categoria"
    )

    class Settings:
        name = "Categorias_libro"
        indexes = [
            IndexModel([("nombre", ASCENDING)], unique=True)
        ]