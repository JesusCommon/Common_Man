from pydantic import field_validator, BaseModel, Field, ConfigDict
from uuid import UUID
from datetime import datetime
from src.modules.usuarios.schema import UsuarioPublicResponse

class FollowValidaciones:
    @field_validator("username", mode="before", check_fields=False)
    @classmethod
    def validar_username(cls, v):
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("El username debe ser texto")
        v = v.strip()
        if len(v) < 3:
            raise ValueError("El username tiene que tener minimo 3 caracteres")
        return v.lower()

class FollowCreate(FollowValidaciones, BaseModel):
    username: str = Field(
        ...,
        description="Username del usuario que se desea seguir"
    )

class FollowPublicResponse(BaseModel):
    identificador: UUID
    seguidor: UsuarioPublicResponse
    seguido: UsuarioPublicResponse
    activo: bool
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)