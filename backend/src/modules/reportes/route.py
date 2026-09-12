from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.modules.reportes.controller import ReporteController
from src.modules.reportes.document import EstadoReporteEnum
from src.modules.reportes.schema import (
    ReporteCreate,
    ReporteResponse,
    ReporteAdminResponse,
    MensajeCreate,
    ReporteEstadoUpdate,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/reportes", tags=["Reportes"])
controller = ReporteController()

@router.post(
    "/",
    response_model=RespuestaConMensaje[ReporteResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def crear_reporte(
    data: ReporteCreate,
    usuario=Depends(obtener_usuario_actual),
):
    reporte = await controller.crear_reporte(data, usuario)
    return RespuestaConMensaje(
        mensaje="Reporte creado correctamente",
        data=reporte,
    )

@router.get(
    "/",
    response_model=Paginado[ReporteResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def listar_mis_reportes(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario=Depends(obtener_usuario_actual),
):
    reportes, total = await controller.listar_reportes_usuario(
        usuario_id=usuario.id,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=reportes, total=total, skip=skip, limit=limit)

@router.get(
    "/{reporte_id}",
    response_model=ReporteResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_mi_reporte(
    reporte_id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    return await controller.obtener_reporte_usuario(reporte_id, usuario.id)

@router.post(
    "/{reporte_id}/mensajes",
    response_model=RespuestaConMensaje[ReporteResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def responder_mi_reporte(
    reporte_id: PydanticObjectId,
    data: MensajeCreate,
    usuario=Depends(obtener_usuario_actual),
):
    reporte = await controller.responder_reporte_usuario(reporte_id, data, usuario)
    return RespuestaConMensaje(
        mensaje="Mensaje enviado correctamente",
        data=reporte,
    )

@router.delete(
    "/{reporte_id}",
    response_model=RespuestaConMensaje[dict],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def eliminar_mi_reporte(
    reporte_id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    await controller.eliminar_reporte_usuario(reporte_id, usuario.id)
    return RespuestaConMensaje(
        mensaje="Reporte eliminado correctamente",
        data={"reporte_id": str(reporte_id)},
    )

@router.get(
    "/admin/all",
    response_model=Paginado[ReporteAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_todos_reportes_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    reportes, total = await controller.listar_reportes_admin(
        skip=skip,
        limit=limit,
    )
    return Paginado(items=reportes, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/estado/{estado}",
    response_model=Paginado[ReporteAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_reportes_por_estado_admin(
    estado: EstadoReporteEnum,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    reportes, total = await controller.listar_reportes_por_estado_admin(
        estado=estado,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=reportes, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/{reporte_id}",
    response_model=ReporteAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_reporte_admin(reporte_id: PydanticObjectId):
    return await controller.obtener_reporte_admin(reporte_id)

@router.post(
    "/admin/{reporte_id}/mensajes",
    response_model=RespuestaConMensaje[ReporteAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def responder_reporte_admin(
    reporte_id: PydanticObjectId,
    data: MensajeCreate,
    admin=Depends(obtener_usuario_admin),
):
    reporte = await controller.responder_reporte_admin(reporte_id, data, admin)
    return RespuestaConMensaje(
        mensaje="Respuesta enviada correctamente",
        data=reporte,
    )

@router.patch(
    "/admin/{reporte_id}/estado",
    response_model=RespuestaConMensaje[ReporteAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_estado_reporte_admin(
    reporte_id: PydanticObjectId,
    data: ReporteEstadoUpdate,
    admin=Depends(obtener_usuario_admin),
):
    reporte = await controller.actualizar_estado_admin(reporte_id, data, admin)
    return RespuestaConMensaje(
        mensaje=f"Estado actualizado a '{reporte.estado.value}'",
        data=reporte,
    )

@router.delete(
    "/admin/{reporte_id}",
    response_model=RespuestaConMensaje[dict],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def eliminar_reporte_admin(reporte_id: PydanticObjectId):
    await controller.eliminar_reporte_admin(reporte_id)
    return RespuestaConMensaje(
        mensaje="Reporte eliminado correctamente",
        data={"reporte_id": str(reporte_id)},
    )