from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class Genero(Document, StatusMixin, TimestampMixim):
    nombre : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre del genero"
    )

    descripcion : str | None = Field(
        default=None,
        max_length=1000,
        description="Descripcion del genero"
    )

    class Settings:
        name = "generos"
        indexes = [
            IndexModel([("nombre", ASCENDING)], unique=True)
        ]