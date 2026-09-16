from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class Editorial(Document, StatusMixin, TimestampMixim):
    nombre : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre de la editorial que publica"
    )

    descripcion : str | None = Field(
        default=None,
        max_length=1000,
        description="Descripcion del edtorial"
    )

    class Settings:
        name = "editoriales"
        indexes = [
            IndexModel([("nombre", ASCENDING)], unique=True)
        ]