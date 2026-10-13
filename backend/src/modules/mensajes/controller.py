from beanie import PydanticObjectId
from src.modules.mensajes.schema import (
    ContadoresResponse,
    ConversacionDetalleResponse,
    ConversacionResponse,
    MensajeCreate,
    MensajeResponse,
    MensajeUpdate,
)
from src.modules.mensajes.service import MensajeService
from src.modules.usuarios.document import Usuario

class MensajeController:
    def __init__(self):
        self.service = MensajeService()

    async def enviar_mensaje(
        self, usuario: Usuario, destinatario_id: PydanticObjectId, data: MensajeCreate
    ) -> MensajeResponse:
        return await self.service.enviar_mensaje(usuario, destinatario_id, data)

    async def obtener_bandeja(
        self, usuario: Usuario, skip: int = 0, limit: int = 20
    ) -> list[ConversacionResponse]:
        return await self.service.obtener_bandeja(usuario, skip, limit)

    async def obtener_solicitudes(
        self, usuario: Usuario, skip: int = 0, limit: int = 20
    ) -> list[ConversacionResponse]:
        return await self.service.obtener_solicitudes(usuario, skip, limit)

    async def obtener_detalle(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionDetalleResponse:
        return await self.service.obtener_detalle(usuario, conversacion_id)

    async def obtener_historial(
        self, usuario: Usuario, conversacion_id: PydanticObjectId, skip: int = 0, limit: int = 50
    ) -> list[MensajeResponse]:
        return await self.service.obtener_historial(usuario, conversacion_id, skip, limit)

    async def marcar_leido(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionResponse:
        return await self.service.marcar_leido(usuario, conversacion_id)

    async def aceptar_solicitud(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionResponse:
        return await self.service.aceptar_solicitud(usuario, conversacion_id)

    async def rechazar_solicitud(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionResponse:
        return await self.service.rechazar_solicitud(usuario, conversacion_id)

    async def editar_mensaje(
        self, usuario: Usuario, mensaje_id: PydanticObjectId, data: MensajeUpdate
    ) -> MensajeResponse:
        return await self.service.editar_mensaje(usuario, mensaje_id, data)

    async def eliminar_mensaje(
        self, usuario: Usuario, mensaje_id: PydanticObjectId
    ) -> MensajeResponse:
        return await self.service.eliminar_mensaje(usuario, mensaje_id)

    async def ocultar_mensaje(
        self, usuario: Usuario, mensaje_id: PydanticObjectId
    ) -> MensajeResponse:
        return await self.service.ocultar_mensaje(usuario, mensaje_id)

    async def ocultar_conversacion(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> None:
        return await self.service.ocultar_conversacion(usuario, conversacion_id)

    async def obtener_contadores(self, usuario: Usuario) -> ContadoresResponse:
        no_leidos = await self.service.contar_no_leidos(usuario)
        solicitudes = await self.service.contar_solicitudes(usuario)
        return ContadoresResponse(
            mensajes_no_leidos=no_leidos,
            solicitudes_pendientes=solicitudes,
        )