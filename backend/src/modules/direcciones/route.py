from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.modules.direcciones.controller import DireccionController
from src.modules.direcciones.schema import (
    DireccionCreate,
    DireccionUpdate,
    DireccionResponse,
    DireccionAdminResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/direcciones", tags=["Direcciones"])
controller = DireccionController()

@router.post(
    "/",
    response_model=RespuestaConMensaje[DireccionResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def crear_direccion(
    data: DireccionCreate,
    usuario=Depends(obtener_usuario_actual),
):
    direccion = await controller.crear(data, usuario_id=usuario.id)
    return RespuestaConMensaje(
        mensaje="Dirección creada correctamente",
        data=direccion
    )

@router.get(
    "/",
    response_model=Paginado[DireccionResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def listar_mis_direcciones(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario=Depends(obtener_usuario_actual),
):
    direcciones, total = await controller.listar_por_usuario(
        usuario_id=usuario.id,
        skip=skip,
        limit=limit
    )
    return Paginado(items=direcciones, total=total, skip=skip, limit=limit)


@router.get(
    "/{id}",
    response_model=DireccionResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_direccion(
    id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    return await controller.obtener_por_id(id, usuario_id=usuario.id)


@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[DireccionResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def actualizar_direccion(
    id: PydanticObjectId,
    data: DireccionUpdate,
    usuario=Depends(obtener_usuario_actual),
):
    direccion = await controller.actualizar(id, data, usuario_id=usuario.id)
    return RespuestaConMensaje(
        mensaje="Dirección actualizada correctamente",
        data=direccion
    )


@router.patch(
    "/{id}/predeterminada",
    response_model=RespuestaConMensaje[DireccionResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def marcar_predeterminada(
    id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    direccion = await controller.marcar_predeterminada(id, usuario_id=usuario.id)
    return RespuestaConMensaje(
        mensaje="Dirección marcada como predeterminada",
        data=direccion
    )


@router.delete(
    "/{id}",
    response_model=RespuestaConMensaje[DireccionResponse],
    status_code=200,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def eliminar_direccion(
    id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    direccion = await controller.desactivar(id, usuario_id=usuario.id)
    return RespuestaConMensaje(
        mensaje="Dirección eliminada correctamente",
        data=direccion
    )

@router.get(
    "/admin/usuario/{usuario_id}",
    response_model=Paginado[DireccionAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_direcciones_de_usuario(
    usuario_id: PydanticObjectId,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    from src.modules.direcciones.service import DireccionService
    service = DireccionService()
    
    direcciones, total = await service.repo.listar_por_usuario(
        usuario_id=usuario_id,
        skip=skip,
        limit=limit,
        solo_activas=False
    )
    return Paginado(items=direcciones, total=total, skip=skip, limit=limit)