# routes/seguimiento_route.py
from fastapi import APIRouter, Depends
from beanie import PydanticObjectId
from app.controllers.follow_controller import SeguimientoController
from app.models.usuarios_model import Usuario
from app.core.security import obtener_usuario_actual  # tu dependency del token

router = APIRouter(prefix="/seguimientos", tags=["Seguimientos"])
controller = SeguimientoController()


@router.post("/{seguido_id}/seguir")
async def seguir(seguido_id: PydanticObjectId, usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    return await controller.seguir(usuario_actual.id, seguido_id)


@router.delete("/{seguido_id}/dejar-de-seguir")
async def dejar_de_seguir(seguido_id: PydanticObjectId, usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    return await controller.dejar_de_seguir(usuario_actual.id, seguido_id)


@router.get("/{usuario_id}/seguidores")
async def listar_seguidores(usuario_id: PydanticObjectId):
    return await controller.listar_seguidores(usuario_id)


@router.get("/{usuario_id}/seguidos")
async def listar_seguidos(usuario_id: PydanticObjectId):
    return await controller.listar_seguidos(usuario_id)