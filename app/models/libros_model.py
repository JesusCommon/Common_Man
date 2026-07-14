from beanie import Document, Link
from pydantic import Field, HttpUrl, ConfigDict
from enum import Enum
from pymongo import IndexModel, ASCENDING
from app.models.mixins import TimestampMixim, StatusMixin
from app.models.categoria_libro_model import Categoria

class Idioma(str, Enum):
    ESPANOL = "Español"
    INGLES = "Inglés"
    PORTUGUES = "Portugués"


class Libro(Document, TimestampMixim, StatusMixin):
    model_config = ConfigDict(validate_assignment=True)  # 👈 agregar esto

    nombre: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Nombre del libro",
        examples=["100 años de soledad"]
    )

    autor: str = Field(
        ...,
        min_length=3,
        max_length=150,
        description="Autor o escritor del libro",
        examples=["Gabriel Garcia Marquez"]
    )

    descripcion: str | None = Field(
        default=None,
        max_length=1000,
        description="Descripción del libro"
    )

    anio_publicacion: int = Field(
        ...,
        ge=1000,
        description="Año de publicación",
        examples=[1990]
    )

    portada: HttpUrl | None = Field(
        default=None,
        description="URL de la imagen del libro"
    )

    editorial: str | None = Field(
        default=None,
        max_length=150,
        description="Editorial del libro"
    )

    idioma: Idioma = Field(
        default=Idioma.ESPANOL,
        description="Idioma del libro"
    )

    stock: int = Field(
        default=0,
        ge=0,
        description="Cantidad de libros en stock",
        examples=[10]
    )

    precio: float = Field(
        default=0,
        ge=0,
        description="Precio del libro",
        examples=[50000]
    )

    categoria: Link[Categoria] = Field(
        ...,
        description="Categoría del libro"
    )

    contenido: HttpUrl = Field(
        ...,
        description="URL del archivo PDF (no exponer en respuestas públicas del catálogo)"
    )

    descargas: int = Field(
        default=0,
        ge=0,
        description="Cantidad de descargas del libro"
    )

    class Settings:
        name = "libros"
        indexes = [
            IndexModel([("categoria", ASCENDING)]),
            IndexModel([("nombre", ASCENDING)]),
        ]