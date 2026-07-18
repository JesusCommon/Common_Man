from beanie import Document, Link
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from app.models.mixins import TimestampMixim
from app.models.usuarios_model import Usuario


class Seguimiento(TimestampMixim, Document):
    seguidor: Link[Usuario] = Field(..., description="Usuario que sigue")
    seguido: Link[Usuario] = Field(..., description="Usuario que es seguido")

    class Settings:
        name = "seguimientos"
        indexes = [
            IndexModel([("seguidor", ASCENDING), ("seguido", ASCENDING)], unique=True),
            IndexModel([("seguidor", ASCENDING)]),
            IndexModel([("seguido", ASCENDING)]),
        ]