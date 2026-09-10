from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.core.websocket.dependencies import get_current_user_ws
from src.core.websocket.manager import manager
from src.modules.notificaciones.controller import NotificacionController
from src.modules.notificaciones.schema import (
    NotificacionCreate,
    NotificacionResponse,
    NotificacionAdminResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/notificaciones", tags=["Notificaciones"])
controller = NotificacionController()

@router.get(
    "/",
    response_model=Paginado[NotificacionResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def listar_mis_notificaciones(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    solo_no_leidas: bool = Query(default=False),
    usuario=Depends(obtener_usuario_actual),
):
    notificaciones, total = await controller.listar(
        usuario_id=usuario.id,
        skip=skip,
        limit=limit,
        solo_no_leidas=solo_no_leidas,
    )
    return Paginado(items=notificaciones, total=total, skip=skip, limit=limit)

@router.get(
    "/no-leidas/count",
    response_model=RespuestaConMensaje[int],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def contar_no_leidas(usuario=Depends(obtener_usuario_actual)):
    count = await controller.contar_no_leidas(usuario.id)
    return RespuestaConMensaje(mensaje="Conteo actualizado", data=count)

@router.patch(
    "/{id}/leida",
    response_model=RespuestaConMensaje[NotificacionResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def marcar_como_leida(
    id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    notif = await controller.marcar_leida(id, usuario.id)
    return RespuestaConMensaje(mensaje="Notificación marcada como leída", data=notif)

@router.patch(
    "/marcar-todas-leidas",
    response_model=RespuestaConMensaje[dict],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def marcar_todas_como_leidas(usuario=Depends(obtener_usuario_actual)):
    count = await controller.marcar_todas_leidas(usuario.id)
    return RespuestaConMensaje(
        mensaje=f"Se marcaron {count} notificaciones como leídas",
        data={"actualizadas": count}
    )

@router.delete(
    "/{id}",
    response_model=RespuestaConMensaje[dict],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def eliminar_notificacion(
    id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    eliminada = await controller.eliminar(id, usuario.id)
    if not eliminada:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    return RespuestaConMensaje(mensaje="Notificación eliminada", data={"id": str(id)})

@router.post(
    "/admin/crear",
    response_model=RespuestaConMensaje[NotificacionAdminResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def crear_notificacion_admin(data: NotificacionCreate):
    notif = await controller.crear_y_enviar(data)
    return RespuestaConMensaje(mensaje="Notificación enviada", data=notif)

@router.websocket("/ws")
async def websocket_notificaciones(
    websocket: WebSocket, 
    usuario=Depends(get_current_user_ws)
):
    await manager.connect(websocket, str(usuario.id))
    
    try:
        while True:
            data = await websocket.receive_text()
            
            if data == "ping":
                await websocket.send_text("pong")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, str(usuario.id))