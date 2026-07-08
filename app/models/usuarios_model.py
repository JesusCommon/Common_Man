from beanie import Document
from pydantic import Field, EmailStr, HttpUrl
from pymongo import IndexModel, ASCENDING
from uuid import UUID, uuid4
from enum import Enum
from app.models.mixins import TimestampMixim, StatusMixin


class RolUsuario(str, Enum):
    USUARIO = "usuario"
    ADMIN = "admin"


class Usuario(Document, TimestampMixim, StatusMixin):
    nombre: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Nombres del usuario",
        examples=["Jesus Manuel"]
    )

    apellido: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
        description="Apellidos del usuario",
        examples=["Teran Vergara"]
    )

    username: str = Field(
        ...,
        min_length=3,
        max_length=30,
        description="Nombre de usuario único",
        examples=["jesusteran"]
    )

    telefono: str | None = Field(
        default=None,
        min_length=5,
        max_length=30,
        description="Telefono celular unico del usuario",
        examples=["3122960906"]
    )

    password: str = Field(
        ...,
        min_length=8,
        description="Contraseña del usuario (hasheada antes de guardar)",
        examples=["Letras80_"]
    )

    correo: EmailStr = Field(
        ...,
        description="Correo electronico unico del usuario",
        examples=["example@gmail.com"]
    )

    identificador: UUID = Field(
        default_factory=uuid4,
        description="Identificador único de cada usuario"
    )

    saldo: float = Field(
        default=0,
        ge=0,
        description="Saldo del usuario",
        examples=[1000]
    )

    rol: RolUsuario = Field(
        default=RolUsuario.USUARIO,
        description="Rol del usuario dentro del sistema"
    )
    
    avatar: HttpUrl | None = Field(
        default=None,
        description="URL de la foto de perfil"
    )

    bio: str | None = Field(
        default=None,
        max_length=280,
        description="Breve descripción del usuario"
    )

    class Settings:
        name = "usuarios"
        indexes = [
            IndexModel([("username", ASCENDING)], unique=True),
            IndexModel([("telefono", ASCENDING)],
            unique=True,
            partialFilterExpression={"telefono": {"$type": "string"}}),
            IndexModel([("correo", ASCENDING)], unique=True),
            IndexModel([("identificador", ASCENDING)], unique=True),
    ]