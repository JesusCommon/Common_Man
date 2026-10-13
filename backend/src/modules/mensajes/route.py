from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, Query, status
from src.core.security.jwt import obtener_usuario_actual
from src.modules.mensajes.controller import MensajeController
from src.modules.mensajes.schema import (
    ContadoresResponse,
    ConversacionDetalleResponse,
    ConversacionResponse,
    MensajeCreate,
    MensajeResponse,
    MensajeUpdate,
)
from src.modules.usuarios.document import Usuario

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])
controller = MensajeController()

@router.get("/contadores", response_model=ContadoresResponse)
async def obtener_contadores(usuario: Usuario = Depends(obtener_usuario_actual)):
    return await controller.obtener_contadores(usuario)

@router.get("/conversaciones", response_model=list[ConversacionResponse])
async def obtener_bandeja(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.obtener_bandeja(usuario, skip, limit)

@router.get("/solicitudes", response_model=list[ConversacionResponse])
async def obtener_solicitudes(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.obtener_solicitudes(usuario, skip, limit)

@router.get("/conversaciones/{conversacion_id}", response_model=ConversacionDetalleResponse)
async def obtener_detalle(
    conversacion_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.obtener_detalle(usuario, conversacion_id)

@router.get("/conversaciones/{conversacion_id}/mensajes", response_model=list[MensajeResponse])
async def obtener_historial(
    conversacion_id: PydanticObjectId,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.obtener_historial(usuario, conversacion_id, skip, limit)

@router.patch("/conversaciones/{conversacion_id}/leer", response_model=ConversacionResponse)
async def marcar_leido(
    conversacion_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.marcar_leido(usuario, conversacion_id)

@router.patch("/conversaciones/{conversacion_id}/aceptar", response_model=ConversacionResponse)
async def aceptar_solicitud(
    conversacion_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.aceptar_solicitud(usuario, conversacion_id)

@router.patch("/conversaciones/{conversacion_id}/rechazar", response_model=ConversacionResponse)
async def rechazar_solicitud(
    conversacion_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.rechazar_solicitud(usuario, conversacion_id)

@router.delete("/conversaciones/{conversacion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def ocultar_conversacion(
    conversacion_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    await controller.ocultar_conversacion(usuario, conversacion_id)

@router.post(
    "/usuario/{destinatario_id}",
    response_model=MensajeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def enviar_mensaje(
    destinatario_id: PydanticObjectId,
    data: MensajeCreate,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    # Opcional (rate limit anti-spam con slowapi):
    # @limiter.limit("20/minute")
    return await controller.enviar_mensaje(usuario, destinatario_id, data)

@router.patch("/{mensaje_id}", response_model=MensajeResponse)
async def editar_mensaje(
    mensaje_id: PydanticObjectId,
    data: MensajeUpdate,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.editar_mensaje(usuario, mensaje_id, data)

@router.delete("/{mensaje_id}", response_model=MensajeResponse)
async def eliminar_mensaje(
    mensaje_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.eliminar_mensaje(usuario, mensaje_id)

@router.patch("/{mensaje_id}/ocultar", response_model=MensajeResponse)
async def ocultar_mensaje(
    mensaje_id: PydanticObjectId,
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.ocultar_mensaje(usuario, mensaje_id)