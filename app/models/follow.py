from beanie import Document, Link
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from app.models.mixins import TimestampMixim
from app.models.usuarios_model import Usuario


class Seguimiento(Document, TimestampMixim):
    seguidor: Link[Usuario] = Field(
        ...,
        description="Usuario que realiza la acción de seguir"
    )

    seguido: Link[Usuario] = Field(
        ...,
        description="Usuario que está siendo seguido"
    )

    class Settings:
        name = "seguimientos"
        indexes = [
            IndexModel(
                [("seguidor", ASCENDING), ("seguido", ASCENDING)],
                unique=True
            ),
            IndexModel([("seguidor", ASCENDING)]),
            IndexModel([("seguido", ASCENDING)]),
        ]