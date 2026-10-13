from beanie import PydanticObjectId
from src.shared.repositories.BaseRepo import BaseRepo
from src.modules.mensajes.document import Conversacion, Mensaje, EstadoConversacion
from src.modules.mensajes.schema import (
    ConversacionCreate,
    ConversacionUpdate,
    MensajeNuevo,
    MensajeUpdate,
)

MAX_LIMIT = 100

def generar_clave(usuario_a: PydanticObjectId, usuario_b: PydanticObjectId) -> str:
    ids = sorted([str(usuario_a), str(usuario_b)])
    return f"{ids[0]}_{ids[1]}"

class ConversacionRepo(BaseRepo[Conversacion, ConversacionCreate, ConversacionUpdate]):
    def __init__(self):
        super().__init__(Conversacion)

    async def obtener_por_clave(self, clave: str) -> Conversacion | None:
        return await self.model.find_one(self.model.clave == clave)

    async def obtener_entre(
        self, usuario_a: PydanticObjectId, usuario_b: PydanticObjectId
    ) -> Conversacion | None:
        return await self.obtener_por_clave(generar_clave(usuario_a, usuario_b))

    async def guardar(self, conversacion: Conversacion) -> Conversacion:
        await conversacion.save()
        return conversacion

    async def listar_bandeja(
        self, usuario_id: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> list[Conversacion]:
        limit = min(limit, MAX_LIMIT)
        return await self.model.find(
            {
                "participantes": usuario_id,
                "estado": EstadoConversacion.ACEPTADA.value,
                "oculta_para": {"$ne": usuario_id},
            }
        ).sort([("ultimo_fecha", -1)]).skip(skip).limit(limit).to_list()

    async def listar_solicitudes(
        self, usuario_id: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> list[Conversacion]:
        limit = min(limit, MAX_LIMIT)
        return await self.model.find(
            {
                "participantes": usuario_id,
                "estado": EstadoConversacion.PENDIENTE.value,
                "solicitante_id": {"$ne": usuario_id},
                "oculta_para": {"$ne": usuario_id},
            }
        ).sort([("ultimo_fecha", -1)]).skip(skip).limit(limit).to_list()

    async def listar_para_contador(
        self, usuario_id: PydanticObjectId
    ) -> list[Conversacion]:
        return await self.model.find(
            {
                "participantes": usuario_id,
                "estado": EstadoConversacion.ACEPTADA.value,
                "oculta_para": {"$ne": usuario_id},
            }
        ).to_list()

    async def contar_solicitudes(self, usuario_id: PydanticObjectId) -> int:
        return await self.model.find(
            {
                "participantes": usuario_id,
                "estado": EstadoConversacion.PENDIENTE.value,
                "solicitante_id": {"$ne": usuario_id},
                "oculta_para": {"$ne": usuario_id},
            }
        ).count()

class MensajeRepo(BaseRepo[Mensaje, MensajeNuevo, MensajeUpdate]):
    def __init__(self):
        super().__init__(Mensaje)

    async def guardar(self, mensaje: Mensaje) -> Mensaje:
        await mensaje.save()
        return mensaje

    async def listar_historial(
        self,
        conversacion_id: PydanticObjectId,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Mensaje]:
        limit = min(limit, MAX_LIMIT)
        mensajes = await self.model.find(
            {
                "conversacion_id": conversacion_id,
                "eliminado_para": {"$ne": usuario_id},
            }
        ).sort([("fecha_creacion", -1)]).skip(skip).limit(limit).to_list()
        mensajes.reverse()
        return mensajes

    async def marcar_leidos(
        self, conversacion_id: PydanticObjectId, remitente_id: PydanticObjectId
    ) -> None:
        await self.model.find(
            {
                "conversacion_id": conversacion_id,
                "remitente_id": remitente_id,
                "leido": False,
            }
        ).update_many({"$set": {"leido": True}})