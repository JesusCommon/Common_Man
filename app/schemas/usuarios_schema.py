import re
from pydantic import field_validator, BaseModel, Field, EmailStr, HttpUrl, ConfigDict
from beanie import PydanticObjectId
from uuid import UUID
from app.models.usuarios_model import RolUsuario
from datetime import datetime

class UsuarioValidaciones:
    @field_validator("nombre", mode="before")
    @classmethod
    def validar_nombre(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El nombre debe ser texto")
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El nombre tiene que tener al menos 2 caracteres")
        if not re.fullmatch(r"[A-Za-zÀ-ÿñÑ\s]+", v):
            raise ValueError("El nombre solo puede llevar letras")
        return v.title()

    @field_validator("apellido", mode="before")
    @classmethod
    def validar_apellido(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El apellido debe ser texto")
        v = v.strip()
        if len(v) < 2:
            raise ValueError("El apellido tiene que tener al menos 2 caracteres")
        if not re.fullmatch(r"[A-Za-zÀ-ÿñÑ\s]+", v):
            raise ValueError("El apellido solo puede llevar letras")
        return v.title()

    @field_validator("telefono", mode="before")
    @classmethod
    def validar_telefono(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El teléfono debe ser texto")
        v = v.strip()
        if not re.fullmatch(r"\+?[0-9]{7,15}", v):
            raise ValueError("Número telefónico inválido")
        return v

    @field_validator("username", mode="before")
    @classmethod
    def validar_username(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El username tiene que ser texto")
        v = v.strip()
        if len(v) < 3:
            raise ValueError("El username tiene que tener minimo 3 caracteres")
        if not re.fullmatch(r"[A-Za-z0-9_]+", v):
            raise ValueError("El username solo puede llevar letras, numero o guión bajo")
        return v.lower()

    @field_validator("correo", mode="before")
    @classmethod
    def validar_correo(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El correo debe ser texto")
        return v.strip().lower()

    @field_validator("bio", mode="before")
    @classmethod
    def validar_bio(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La bio debe ser texto")
        v = v.strip()
        if len(v) > 40:
            raise ValueError("La bio no puede tener más de 40 caracteres")
        return v
    
    @field_validator("avatar", mode="before")
    @classmethod
    def validar_avatar(cls, v):
        if v is None:
            return None
        url = str(v)
        if not url.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            raise ValueError("El avatar debe ser una URL con extensión .jpg, .jpeg, .png o .webp")
        return v


class PasswordValidacion:
    @field_validator("password", mode="before")
    @classmethod
    def validar_password(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La contraseña debe ser texto")
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not re.search(r"[A-Z]", v):
            raise ValueError("La contraseña debe tener al menos una Mayuscula")
        if not re.search(r"[a-z]", v):
            raise ValueError("La contraseña debe tener al menos una minuscula")
        if not re.search(r"\d", v):
            raise ValueError("La contraseña debe tener al menos un numero")
        if re.search(r"\s", v):
            raise ValueError("La contraseña no puede contener espacios")
        if not re.search(r"[!@#$%&(),.?\":{}|<>_\-]", v):
            raise ValueError("La contraseña debe tener al menos un simbolo")
        return v


class UsuarioCreate(UsuarioValidaciones, PasswordValidacion, BaseModel):
    nombre: str = Field(...)
    apellido: str | None = Field(default=None)
    username: str = Field(...)
    telefono: str | None = Field(default=None)
    correo: EmailStr = Field(...)
    password: str = Field(...)
    bio: str | None = Field(default=None)
    avatar: HttpUrl | None = Field(default=None)
    saldo: float | None = Field(default=None)

    @field_validator("saldo", mode="before")
    @classmethod
    def validar_saldo(cls, v):
        if v is None:
            return None
        if not isinstance(v, (int, float)):
            raise ValueError("El saldo debe ser un número")
        if v <= 0:
            raise ValueError("El saldo debe ser mayor a 0")
        return v


class UsuarioUpdate(UsuarioValidaciones, BaseModel):
    nombre: str | None = Field(default=None)
    apellido: str | None = Field(default=None)
    username: str | None = Field(default=None)
    telefono: str | None = Field(default=None)
    correo: EmailStr | None = Field(default=None)
    bio: str | None = Field(default=None)
    avatar: HttpUrl | None = Field(default=None)


class UsuarioCambiarPassword(PasswordValidacion, BaseModel):
    password_actual: str = Field(...)
    password: str = Field(...)


class UsuarioRecargarSaldo(BaseModel):
    monto: float = Field(...)

    @field_validator("monto", mode="before")
    @classmethod
    def validar_monto(cls, v):
        if not isinstance(v, (int, float)):
            raise ValueError("El monto debe ser un número")
        if v <= 0:
            raise ValueError("El monto debe ser mayor a 0")
        return v

class UsuarioResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    apellido: str | None = None
    username: str
    telefono: str | None = None
    correo: EmailStr
    bio: str | None = None
    avatar: HttpUrl | None = None
    identificador : UUID
    rol : RolUsuario
    saldo: float
    activo: bool
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)