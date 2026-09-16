from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class Autor(Document, StatusMixin, TimestampMixim):
    nombre : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre del autor"
    )

    apellido : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Apellido del autor"
    )

    pais_nacimiento : str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
        description="Pais de nacimiento del autor"
    )

    class Settings:
        name = "autores"
        indexes = [
            IndexModel(
                [("nombre", ASCENDING), ("apellido", ASCENDING)], unique=True)
        ]
