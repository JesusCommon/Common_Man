import re
from pydantic import field_validator, BaseModel, Field, EmailStr, HttpUrl, ConfigDict
from uuid import UUID
from beanie import PydanticObjectId
from src.modules.usuarios.document import RolUsuario
from datetime import datetime
from decimal import Decimal

class UsuarioValidaciones:
    @field_validator("nombre", mode="before", check_fields=False)
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

    @field_validator("apellido", mode="before", check_fields=False)
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

    @field_validator("telefono", mode="before", check_fields=False)
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

    @field_validator("username", mode="before", check_fields=False)
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

    @field_validator("correo", mode="before", check_fields=False)
    @classmethod
    def validar_correo(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El correo debe ser texto")
        return v.strip().lower()

    @field_validator("bio", mode="before", check_fields=False)
    @classmethod
    def validar_bio(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("La bio debe ser texto")
        v = v.strip()
        if len(v) > 280:
            raise ValueError("La bio no puede tener más de 280 caracteres")
        return v

    @field_validator("avatar", mode="before", check_fields=False)
    @classmethod
    def validar_avatar(cls, v):
        if v is None:
            return None
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


class UsuarioUpdate(UsuarioValidaciones, BaseModel):
    nombre: str | None = Field(default=None)
    apellido: str | None = Field(default=None)
    username: str | None = Field(default=None)
    telefono: str | None = Field(default=None)
    correo: EmailStr | None = Field(default=None)
    bio: str | None = Field(default=None)
    avatar: HttpUrl | None = Field(default=None)


class UsuarioAdminUpdate(UsuarioUpdate):
    rol: RolUsuario | None = Field(default=None)
    activo: bool | None = Field(default=None)
    saldo: Decimal | None = Field(default=None, ge=0)


class UsuarioCambiarPassword(PasswordValidacion, BaseModel):
    password_actual: str = Field(...)
    password: str = Field(...)


class UsuarioRecargarSaldo(BaseModel):
    monto: Decimal = Field(...)

    @field_validator("monto", mode="before")
    @classmethod
    def validar_monto(cls, v):
        if v is None:
            raise ValueError("El monto es obligatorio")
        return Decimal(str(v)).quantize(Decimal("0.01"))

class UsuarioPublicResponse(BaseModel):
    nombre: str
    apellido: str | None = None
    username: str
    bio: str | None = None
    avatar: HttpUrl | None = None
    activo: bool
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)


class UsuarioPropioResponse(UsuarioPublicResponse):
    identificador: UUID
    correo: EmailStr
    telefono: str | None = None
    saldo: Decimal
    rol: RolUsuario
    fecha_actualizacion: datetime


class UsuarioAdminResponse(UsuarioPropioResponse):
    id: PydanticObjectId

    model_config = ConfigDict(from_attributes=True)