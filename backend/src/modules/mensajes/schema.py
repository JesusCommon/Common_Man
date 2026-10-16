from pydantic import BaseModel, Field, field_validator, field_serializer, ConfigDict
from beanie import PydanticObjectId
from datetime import datetime
from src.modules.mensajes.document import EstadoConversacion, TipoMensaje

class UsuarioMiniResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    apellido: str | None = None
    username: str
    avatar: str | None = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("avatar", mode="before")
    @classmethod
    def normalizar_avatar(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            return v
        if hasattr(v, "unicode_string"):
            return v.unicode_string()
        return str(v)

    @field_serializer("id")
    def serialize_id(self, value: PydanticObjectId) -> str:
        return str(value)


class MensajeValidaciones:
    @field_validator("contenido", mode="before")
    @classmethod
    def validar_contenido(cls, v):
        if v is None:
            raise ValueError("El contenido es obligatorio")
        if not isinstance(v, str):
            raise ValueError("El contenido debe ser texto")
        v = v.strip()
        if not v:
            raise ValueError("El mensaje no puede estar vacío")
        if len(v) > 2000:
            raise ValueError("El mensaje no puede exceder 2000 caracteres")
        return v


class MensajeCreate(MensajeValidaciones, BaseModel):
    contenido: str = Field(...)


class MensajeUpdate(MensajeValidaciones, BaseModel):
    contenido: str = Field(...)


class MensajeResponse(BaseModel):
    id: PydanticObjectId
    conversacion_id: PydanticObjectId
    remitente_id: PydanticObjectId
    contenido: str | None = None
    tipo: TipoMensaje
    leido: bool
    editado: bool
    fecha_edicion: datetime | None = None
    eliminado: bool
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_serializer("id")
    def serialize_id(self, value: PydanticObjectId) -> str:
        return str(value)

    @field_serializer("conversacion_id")
    def serialize_conversacion_id(self, value: PydanticObjectId) -> str:
        return str(value)

    @field_serializer("remitente_id")
    def serialize_remitente_id(self, value: PydanticObjectId) -> str:
        return str(value)

class MensajeNuevo(BaseModel):
    conversacion_id: PydanticObjectId = Field(...)
    remitente_id: PydanticObjectId = Field(...)
    contenido: str = Field(...)
    tipo: TipoMensaje = Field(default=TipoMensaje.TEXTO)

class ConversacionResponse(BaseModel):
    id: PydanticObjectId
    estado: EstadoConversacion
    otro_usuario: UsuarioMiniResponse
    ultimo_mensaje_id: PydanticObjectId | None = None
    ultimo_contenido: str | None = None
    ultimo_remitente_id: PydanticObjectId | None = None
    ultimo_fecha: datetime | None = None
    no_leidos_mios: int = 0
    fecha_creacion: datetime

    @field_serializer("id")
    def serialize_id(self, value: PydanticObjectId) -> str:
        return str(value)

    @field_serializer("ultimo_mensaje_id")
    def serialize_ultimo_mensaje_id(self, value: PydanticObjectId | None) -> str | None:
        return str(value) if value else None

    @field_serializer("ultimo_remitente_id")
    def serialize_ultimo_remitente_id(self, value: PydanticObjectId | None) -> str | None:
        return str(value) if value else None

class ConversacionDetalleResponse(BaseModel):
    id: PydanticObjectId
    estado: EstadoConversacion
    otro_usuario: UsuarioMiniResponse
    no_leidos_mios: int = 0

    @field_serializer("id")
    def serialize_id(self, value: PydanticObjectId) -> str:
        return str(value)

class ConversacionCreate(BaseModel):
    clave: str = Field(...)
    participantes: list[PydanticObjectId] = Field(...)
    solicitante_id: PydanticObjectId = Field(...)
    estado: EstadoConversacion = Field(default=EstadoConversacion.PENDIENTE)

class ConversacionUpdate(BaseModel):
    estado: EstadoConversacion | None = None
    ultimo_mensaje_id: PydanticObjectId | None = None
    ultimo_contenido: str | None = None
    ultimo_remitente_id: PydanticObjectId | None = None
    ultimo_fecha: datetime | None = None
    no_leidos: dict[str, int] | None = None
    oculta_para: list[PydanticObjectId] | None = None

class ContadoresResponse(BaseModel):
    mensajes_no_leidos: int = 0
    solicitudes_pendientes: int = 0