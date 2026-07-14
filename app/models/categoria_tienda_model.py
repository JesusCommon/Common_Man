from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from app.models.mixins import TimestampMixim, StatusMixin

class CategoriaTienda(Document, TimestampMixim, StatusMixin):
    nombre : str = Field(
        ..., 
        min_length=2, 
        max_length=150,
        description="Nombre de la categoria para el producto",
        examples=["Para niños"]
    )

    descripcion : str = Field(
        ...,
        max_length=1000,
        description="Descripcion de la categoría - lo que podemos encontrar en ella y a quienes esta dirigidas"
    )

    class Settings:
        name = "categorias_producto"
        indexes = [
            IndexModel([("nombre", ASCENDING)], unique=True)
        ]