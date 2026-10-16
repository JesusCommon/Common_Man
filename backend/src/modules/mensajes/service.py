from datetime import datetime, timezone
from beanie import PydanticObjectId
from fastapi import HTTPException, status
from src.modules.mensajes.document import Conversacion, EstadoConversacion, Mensaje
from src.modules.mensajes.repo import ConversacionRepo, MensajeRepo, generar_clave
from src.modules.mensajes.schema import (
    ConversacionCreate,
    ConversacionDetalleResponse,
    ConversacionResponse,
    MensajeCreate,
    MensajeNuevo,
    MensajeResponse,
    MensajeUpdate,
    UsuarioMiniResponse,
)
from src.modules.mensajes.events import (
    message_event_bus,
    MensajeNuevoEvent,
    SolicitudNuevaEvent,
    SolicitudProcesadaEvent,
    MensajeLeidoEvent,
    MensajeEditadoEvent,
    MensajeEliminadoEvent,
)
from src.modules.usuarios.document import Usuario
from src.modules.follow.document import Follow


class MensajeService:
    def __init__(self):
        self.conversaciones = ConversacionRepo()
        self.mensajes = MensajeRepo()

    @staticmethod
    def _ahora() -> datetime:
        return datetime.now(timezone.utc)

    @staticmethod
    def _otro_id(conversacion: Conversacion, usuario_id: PydanticObjectId) -> PydanticObjectId:
        return (
            conversacion.participantes[0]
            if conversacion.participantes[1] == usuario_id
            else conversacion.participantes[1]
        )

    @staticmethod
    def _validar_participante(
        conversacion: Conversacion | None, usuario_id: PydanticObjectId
    ) -> Conversacion:
        if not conversacion or usuario_id not in conversacion.participantes:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversación no encontrada",
            )
        return conversacion

    async def _hay_follow_mutuo(
        self, usuario_a: PydanticObjectId, usuario_b: PydanticObjectId
    ) -> bool:
        ida = await Follow.find_one(Follow.seguidor == usuario_a, Follow.seguidor == usuario_b)
        idb = await Follow.find_one(Follow.seguidor == usuario_b, Follow.seguidor == usuario_a)
        return ida is not None and idb is not None

    async def _conversacion_a_response(
        self, conversacion: Conversacion, usuario: Usuario
    ) -> ConversacionResponse:
        otro_id = self._otro_id(conversacion, usuario.id)
        otro = await Usuario.get(otro_id)
        return ConversacionResponse(
            id=conversacion.id,
            estado=conversacion.estado,
            otro_usuario=UsuarioMiniResponse.model_validate(otro),
            ultimo_mensaje_id=conversacion.ultimo_mensaje_id,
            ultimo_contenido=conversacion.ultimo_contenido,
            ultimo_remitente_id=conversacion.ultimo_remitente_id,
            ultimo_fecha=conversacion.ultimo_fecha,
            no_leidos_mios=conversacion.no_leidos.get(str(usuario.id), 0),
            fecha_creacion=conversacion.fecha_creacion,
        )

    def _mensaje_a_response(self, mensaje: Mensaje, usuario: Usuario) -> MensajeResponse:
        oculto = mensaje.eliminado or usuario.id in mensaje.eliminado_para
        return MensajeResponse(
            id=mensaje.id,
            conversacion_id=mensaje.conversacion_id,
            remitente_id=mensaje.remitente_id,
            contenido=None if oculto else mensaje.contenido,
            tipo=mensaje.tipo,
            leido=mensaje.leido,
            editado=mensaje.editado,
            fecha_edicion=mensaje.fecha_edicion,
            eliminado=mensaje.eliminado,
            fecha_creacion=mensaje.fecha_creacion,
        )

    async def enviar_mensaje(
        self, usuario: Usuario, destinatario_id: PydanticObjectId, data: MensajeCreate
    ) -> MensajeResponse:
        if not usuario.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un usuario inactivo",
            )

        destinatario = await Usuario.get(destinatario_id)
        if not destinatario or not destinatario.activo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado",
            )

        if destinatario.id == usuario.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes enviarte mensajes a ti mismo",
            )

        conversacion = await self.conversaciones.obtener_entre(usuario.id, destinatario.id)
        es_solicitud_nueva = False

        if conversacion:
            if conversacion.estado == EstadoConversacion.RECHAZADA:
                if conversacion.solicitante_id == usuario.id:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Tu solicitud de mensaje fue rechazada por este usuario",
                    )
                conversacion.estado = EstadoConversacion.ACEPTADA
            elif conversacion.estado == EstadoConversacion.PENDIENTE:
                if conversacion.solicitante_id != usuario.id:
                    conversacion.estado = EstadoConversacion.ACEPTADA
            if usuario.id in conversacion.oculta_para:
                conversacion.oculta_para.remove(usuario.id)
        else:
            follow_mutuo = await self._hay_follow_mutuo(usuario.id, destinatario.id)
            es_solicitud_nueva = not follow_mutuo
            conversacion = await self.conversaciones.crear(
                ConversacionCreate(
                    clave=generar_clave(usuario.id, destinatario.id),
                    participantes=[usuario.id, destinatario.id],
                    solicitante_id=usuario.id,
                    estado=(
                        EstadoConversacion.ACEPTADA
                        if follow_mutuo
                        else EstadoConversacion.PENDIENTE
                    ),
                )
            )

        mensaje = await self.mensajes.crear(
            MensajeNuevo(
                conversacion_id=conversacion.id,
                remitente_id=usuario.id,
                contenido=data.contenido,
            )
        )

        conversacion.ultimo_mensaje_id = mensaje.id
        conversacion.ultimo_contenido = mensaje.contenido
        conversacion.ultimo_remitente_id = usuario.id
        conversacion.ultimo_fecha = mensaje.fecha_creacion

        clave_dest = str(destinatario.id)
        conversacion.no_leidos[clave_dest] = conversacion.no_leidos.get(clave_dest, 0) + 1
        await self.conversaciones.guardar(conversacion)

        if es_solicitud_nueva:
            await message_event_bus.publish(SolicitudNuevaEvent(
                conversacion_id=str(conversacion.id),
                solicitante_id=str(usuario.id),
                receptor_id=str(destinatario.id),
                preview=mensaje.contenido[:50],
            ))
        else:
            await message_event_bus.publish(MensajeNuevoEvent(
                conversacion_id=str(conversacion.id),
                remitente_id=str(usuario.id),
                destinatario_id=str(destinatario.id),
                mensaje_id=str(mensaje.id),
                contenido=mensaje.contenido,
                fecha=mensaje.fecha_creacion.isoformat(),
            ))

        return self._mensaje_a_response(mensaje, usuario)

    async def obtener_bandeja(
        self, usuario: Usuario, skip: int = 0, limit: int = 20
    ) -> list[ConversacionResponse]:
        conversaciones = await self.conversaciones.listar_bandeja(usuario.id, skip, limit)
        return [await self._conversacion_a_response(c, usuario) for c in conversaciones]

    async def obtener_solicitudes(
        self, usuario: Usuario, skip: int = 0, limit: int = 20
    ) -> list[ConversacionResponse]:
        conversaciones = await self.conversaciones.listar_solicitudes(usuario.id, skip, limit)
        return [await self._conversacion_a_response(c, usuario) for c in conversaciones]

    async def obtener_detalle(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionDetalleResponse:
        conversacion = self._validar_participante(
            await self.conversaciones.obtener_por_id(conversacion_id), usuario.id
        )
        if usuario.id in conversacion.oculta_para:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversación no encontrada",
            )
        otro = await Usuario.get(self._otro_id(conversacion, usuario.id))
        return ConversacionDetalleResponse(
            id=conversacion.id,
            estado=conversacion.estado,
            otro_usuario=UsuarioMiniResponse.model_validate(otro),
            no_leidos_mios=conversacion.no_leidos.get(str(usuario.id), 0),
        )

    async def obtener_historial(
        self, usuario: Usuario, conversacion_id: PydanticObjectId, skip: int = 0, limit: int = 50
    ) -> list[MensajeResponse]:
        conversacion = self._validar_participante(
            await self.conversaciones.obtener_por_id(conversacion_id), usuario.id
        )
        if usuario.id in conversacion.oculta_para:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversación no encontrada",
            )
        mensajes = await self.mensajes.listar_historial(conversacion_id, usuario.id, skip, limit)
        return [self._mensaje_a_response(m, usuario) for m in mensajes]

    async def marcar_leido(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionResponse:
        conversacion = self._validar_participante(
            await self.conversaciones.obtener_por_id(conversacion_id), usuario.id
        )
        otro_id = self._otro_id(conversacion, usuario.id)
        await self.mensajes.marcar_leidos(conversacion_id, otro_id)
        conversacion.no_leidos[str(usuario.id)] = 0
        await self.conversaciones.guardar(conversacion)

        await message_event_bus.publish(MensajeLeidoEvent(
            conversacion_id=str(conversacion.id),
            leido_por=str(usuario.id),
            notificar_a=str(otro_id),
        ))

        return await self._conversacion_a_response(conversacion, usuario)

    async def aceptar_solicitud(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionResponse:
        conversacion = self._validar_participante(
            await self.conversaciones.obtener_por_id(conversacion_id), usuario.id
        )
        if conversacion.estado != EstadoConversacion.PENDIENTE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La solicitud ya fue procesada",
            )
        if conversacion.solicitante_id == usuario.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Solo el receptor puede aceptar esta solicitud",
            )
        conversacion.estado = EstadoConversacion.ACEPTADA
        await self.conversaciones.guardar(conversacion)

        await message_event_bus.publish(SolicitudProcesadaEvent(
            conversacion_id=str(conversacion.id),
            estado=conversacion.estado,
            notificar_a=str(conversacion.solicitante_id),
        ))

        return await self._conversacion_a_response(conversacion, usuario)

    async def rechazar_solicitud(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> ConversacionResponse:
        conversacion = self._validar_participante(
            await self.conversaciones.obtener_por_id(conversacion_id), usuario.id
        )
        if conversacion.estado != EstadoConversacion.PENDIENTE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La solicitud ya fue procesada",
            )
        if conversacion.solicitante_id == usuario.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Solo el receptor puede rechazar esta solicitud",
            )
        conversacion.estado = EstadoConversacion.RECHAZADA
        await self.conversaciones.guardar(conversacion)

        await message_event_bus.publish(SolicitudProcesadaEvent(
            conversacion_id=str(conversacion.id),
            estado=conversacion.estado,
            notificar_a=str(conversacion.solicitante_id),
        ))

        return await self._conversacion_a_response(conversacion, usuario)

    async def editar_mensaje(
        self, usuario: Usuario, mensaje_id: PydanticObjectId, data: MensajeUpdate
    ) -> MensajeResponse:
        mensaje = await self.mensajes.obtener_por_id(mensaje_id)
        if not mensaje:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mensaje no encontrado",
            )
        if mensaje.remitente_id != usuario.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo puedes editar tus propios mensajes",
            )
        if mensaje.eliminado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes editar un mensaje eliminado",
            )

        mensaje.contenido = data.contenido
        mensaje.editado = True
        mensaje.fecha_edicion = self._ahora()
        await self.mensajes.guardar(mensaje)

        conversacion = await self.conversaciones.obtener_por_id(mensaje.conversacion_id)
        if conversacion and conversacion.ultimo_mensaje_id == mensaje.id:
            conversacion.ultimo_contenido = mensaje.contenido
            await self.conversaciones.guardar(conversacion)

        await message_event_bus.publish(MensajeEditadoEvent(
            conversacion_id=str(mensaje.conversacion_id),
            mensaje_id=str(mensaje.id),
            nuevo_contenido=mensaje.contenido,
            participantes=[str(p) for p in conversacion.participantes],
        ))

        return self._mensaje_a_response(mensaje, usuario)

    async def eliminar_mensaje(
            self, usuario: Usuario, mensaje_id: PydanticObjectId
        ) -> MensajeResponse:
            mensaje = await self.mensajes.obtener_por_id(mensaje_id)
            if not mensaje:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Mensaje no encontrado",
                )
            if mensaje.remitente_id != usuario.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Solo puedes eliminar tus propios mensajes",
                )

            mensaje.eliminado = True
            await self.mensajes.guardar(mensaje)

            conversacion = await self.conversaciones.obtener_por_id(mensaje.conversacion_id)
            if conversacion and conversacion.ultimo_mensaje_id == mensaje.id:
                ultimo_valido = await self.mensajes.obtener_ultimo_no_eliminado(conversacion.id)
                if ultimo_valido:
                    conversacion.ultimo_mensaje_id = ultimo_valido.id
                    conversacion.ultimo_contenido = ultimo_valido.contenido
                    conversacion.ultimo_remitente_id = ultimo_valido.remitente_id
                    conversacion.ultimo_fecha = ultimo_valido.fecha_creacion
                else:
                    conversacion.ultimo_mensaje_id = None
                    conversacion.ultimo_contenido = None
                    conversacion.ultimo_remitente_id = None
                    conversacion.ultimo_fecha = None
                await self.conversaciones.guardar(conversacion)

            await message_event_bus.publish(MensajeEliminadoEvent(
                conversacion_id=str(mensaje.conversacion_id),
                mensaje_id=str(mensaje.id),
                eliminado_por=str(usuario.id),
                para_todos=True,
                participantes=[str(p) for p in conversacion.participantes],
            ))

            return self._mensaje_a_response(mensaje, usuario)

    async def ocultar_mensaje(
        self, usuario: Usuario, mensaje_id: PydanticObjectId
    ) -> MensajeResponse:
        mensaje = await self.mensajes.obtener_por_id(mensaje_id)
        if not mensaje:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mensaje no encontrado",
            )
        self._validar_participante(
            await self.conversaciones.obtener_por_id(mensaje.conversacion_id), usuario.id
        )

        if usuario.id not in mensaje.eliminado_para:
            mensaje.eliminado_para.append(usuario.id)
            await self.mensajes.guardar(mensaje)

        return self._mensaje_a_response(mensaje, usuario)

    async def ocultar_conversacion(
        self, usuario: Usuario, conversacion_id: PydanticObjectId
    ) -> None:
        conversacion = self._validar_participante(
            await self.conversaciones.obtener_por_id(conversacion_id), usuario.id
        )
        if usuario.id not in conversacion.oculta_para:
            conversacion.oculta_para.append(usuario.id)
            await self.conversaciones.guardar(conversacion)

    async def contar_no_leidos(self, usuario: Usuario) -> int:
        conversaciones = await self.conversaciones.listar_para_contador(usuario.id)
        return sum(c.no_leidos.get(str(usuario.id), 0) for c in conversaciones)

    async def contar_solicitudes(self, usuario: Usuario) -> int:
        return await self.conversaciones.contar_solicitudes(usuario.id)