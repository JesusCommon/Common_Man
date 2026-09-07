from beanie import Document, PydanticObjectId
from pydantic import Field
from pymongo import IndexModel, ASCENDING, DESCENDING
from src.shared.mixins import StatusMixin, TimestampMixim

class Direcciones(Document, StatusMixin, TimestampMixim):
    usuario_id: PydanticObjectId = Field(
        ...,
        description="ID del usuario dueño de la dirección"
    )

    alias: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Nombre corto para identificar la dirección (ej: Casa, Oficina)"
    )

    nombre_destinatario: str = Field(
        ...,
        min_length=3,
        max_length=150,
        description="Nombre completo de quien recibe el paquete"
    )

    telefono: str = Field(
        ...,
        min_length=7,
        max_length=15,
        description="Teléfono de contacto para el envío"
    )

    direccion: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Dirección principal (ej: Calle 10 # 5-20, Carrera 15 # 80-45)"
    )

    complemento: str | None = Field(
        default=None,
        max_length=200,
        description="Apto, casa, interior, edificio, conjunto, etc."
    )

    barrio: str | None = Field(
        default=None,
        max_length=100,
        description="Barrio o sector"
    )

    ciudad: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Ciudad o municipio"
    )

    departamento: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Departamento (ej: Cundinamarca, Antioquia, Valle del Cauca)"
    )

    codigo_postal: str | None = Field(
        default=None,
        max_length=10,
        description="Código postal (6 dígitos en Colombia)"
    )

    pais: str = Field(
        default="Colombia",
        max_length=100,
        description="País"
    )

    referencias: str | None = Field(
        default=None,
        max_length=300,
        description="Indicaciones adicionales para encontrar la dirección"
    )

    es_predeterminada: bool = Field(
        default=False,
        description="Indica si es la dirección principal del usuario"
    )

    class Settings:
        name = "direcciones"
        indexes = [
            IndexModel([("usuario_id", ASCENDING), ("fecha_creacion", DESCENDING)]),
            IndexModel([("usuario_id", ASCENDING), ("es_predeterminada", ASCENDING)]),
        ]