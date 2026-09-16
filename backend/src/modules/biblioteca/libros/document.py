from decimal import Decimal
from bson import Decimal128
from pydantic import Field, field_validator, HttpUrl
from beanie import Document, PydanticObjectId
from pymongo import IndexModel, ASCENDING
from enum import Enum
from src.shared.mixins import StatusMixin, TimestampMixim

class Idiomas(str, Enum):
    ESPANOL = "Español"
    INGLES = "Ingles"
    PORTUGUES = "Portugues"

class Libro(Document, StatusMixin, TimestampMixim):
    nombre : str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre del titulo del libro"
    )

    autor_id: PydanticObjectId = Field(
        ...,
        description="ID del autor"
    )

    editorial_id: PydanticObjectId = Field(
        ...,
        description="ID de la editorial"
    )

    genero_id: PydanticObjectId = Field(
        ...,
        description="ID del género"
    )

    edicion: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Edición del libro"
    )

    anio_publicacion: int = Field(
        ...,
        ge=1000,
        le=2100,
        description="Año de publicación del libro"
    )

    paginas : int = Field(
        ...,
        gt=0,
        description="Numero de paginas del libro"
    )

    idioma: Idiomas = Field(
        default=Idiomas.ESPANOL,
        description="Idioma del libro"
    )

    portada : str | None = Field(
        default=None,
        description="Portada del libro"
    )

    isbn: str | None = Field(
        default=None,
        max_length=20,
        description="ISBN del libro"
    )

    sku: str | None = Field(
        default=None,
        max_length=50,
        description="Código interno del libro"
    )

    precio: Decimal = Field(
        ...,
        gt=0,
        description="Precio de venta del libro",
    )

    stock: int = Field(
        default=0,
        ge=0,
        description="Cantidad disponible en inventario",
    )

    descripcion : str | None = Field(
        default=None,
        max_length=1000,
        description="Descripcion del libro"
    )

    contenido : HttpUrl = Field(
        ...,
        description="Contenido del libro"
    )

    @field_validator("precio", mode="before")
    @classmethod
    def convertir_decimal128_a_decimal(cls, v):
        if isinstance(v, Decimal128):
            return v.to_decimal()
        return v

    class Settings:
        name = "libros"
        indexes = [
            IndexModel([("isbn", ASCENDING)], unique=True,  partialFilterExpression={"isbn": {"$type": "string"}}),
            IndexModel([("sku", ASCENDING)], unique=True,  partialFilterExpression={"sku": {"$type": "string"}}),
            IndexModel(
                [
                    ("nombre", ASCENDING),
                    ("autor_id", ASCENDING),
                    ("editorial_id", ASCENDING),
                    ("genero_id", ASCENDING),
                    ("edicion", ASCENDING),
                    ("anio_publicacion", ASCENDING),
                ],
                unique=True
            ),
            IndexModel([("autor_id", ASCENDING)]),
            IndexModel([("editorial_id", ASCENDING)]),
            IndexModel([("genero_id", ASCENDING)]),
            IndexModel([("anio_publicacion", ASCENDING)])
        ]