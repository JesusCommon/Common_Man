from beanie import Document, Link
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from uuid import UUID, uuid4
from src.shared.mixins import TimestampMixim, StatusMixin
from src.modules.usuarios.document import Usuario

class Follow(Document, TimestampMixim, StatusMixin):
    seguidor: Link[Usuario] = Field(
        ...,
        description="Usuario que realiza la acción de seguir"
    )

    seguido: Link[Usuario] = Field(
        ...,
        description="Usuario que es seguido"
    )

    identificador: UUID = Field(
        default_factory=uuid4,
        description="Identificador único de cada follow"
    )

    class Settings:
        name = "follows"
        indexes = [
            IndexModel(
                [("seguidor", ASCENDING), ("seguido", ASCENDING)],
                unique=True
            ),
            IndexModel([("seguidor", ASCENDING)]),
            IndexModel([("seguido", ASCENDING)]),
        ]