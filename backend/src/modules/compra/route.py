from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_admin, obtener_usuario_actual
from src.modules.compra.controller import CompraController
from src.modules.compra.document import EstadoCompraEnum
from src.modules.compra.schema import (
    CompraCreate,
    CompraResponse,
    CompraAdminResponse,
    CompraEstadoUpdate,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/compras", tags=["Compras"])
controller = CompraController()

@router.post(
    "/",
    response_model=RespuestaConMensaje[CompraResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def crear_compra(
    data: CompraCreate,
    usuario=Depends(obtener_usuario_actual),
):
    compra = await controller.crear(data, usuario_id=usuario.id)
    return RespuestaConMensaje(
        mensaje="Compra registrada correctamente",
        data=compra
    )

@router.get(
    "/",
    response_model=Paginado[CompraResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def listar_mis_compras(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario=Depends(obtener_usuario_actual),
):
    compras, total = await controller.listar_por_usuario(
        usuario_id=usuario.id,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=compras, total=total, skip=skip, limit=limit)

@router.get(
    "/orden/{numero_orden}",
    response_model=CompraResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_por_numero_orden(numero_orden: str):
    return await controller.obtener_por_numero_orden(numero_orden)

@router.get(
    "/{id}",
    response_model=CompraResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_compra(id: PydanticObjectId):
    return await controller.obtener_por_id(id)

@router.get(
    "/admin/all",
    response_model=Paginado[CompraAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_todas_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    compras, total = await controller.listar_todas(skip=skip, limit=limit)
    return Paginado(items=compras, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/estado/{estado}",
    response_model=Paginado[CompraAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_por_estado_admin(
    estado: EstadoCompraEnum,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    compras, total = await controller.listar_por_estado(
        estado=estado,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=compras, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/{id}",
    response_model=CompraAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_compra_admin(id: PydanticObjectId):
    return await controller.obtener_por_id(id)

@router.patch(
    "/admin/{id}/estado",
    response_model=RespuestaConMensaje[CompraAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_estado_compra(
    id: PydanticObjectId,
    data: CompraEstadoUpdate,
):
    compra = await controller.actualizar_estado(id, data.estado)
    return RespuestaConMensaje(
        mensaje=f"Estado actualizado a '{data.estado.value}'",
        data=compra
    )