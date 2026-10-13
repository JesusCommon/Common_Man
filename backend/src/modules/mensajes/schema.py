from pydantic import BaseModel, Field, field_validator, ConfigDict
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

class ConversacionDetalleResponse(BaseModel):
    id: PydanticObjectId
    estado: EstadoConversacion
    otro_usuario: UsuarioMiniResponse
    no_leidos_mios: int = 0

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