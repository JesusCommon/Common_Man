from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.modules.envios.controller import EnvioController
from src.modules.envios.document import EstadoEnvioEnum
from src.modules.envios.schema import (
    EnvioCreate,
    EnvioUpdate,
    EnvioEstadoUpdate,
    EnvioResponse,
    EnvioAdminResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/envios", tags=["Envíos"])
controller = EnvioController()

@router.get(
    "/",
    response_model=Paginado[EnvioResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def listar_mis_envios(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario=Depends(obtener_usuario_actual),
):
    envios, total = await controller.listar_por_usuario(
        usuario_id=usuario.id,
        skip=skip,
        limit=limit
    )
    return Paginado(items=envios, total=total, skip=skip, limit=limit)

@router.get(
    "/{id}",
    response_model=EnvioResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_envio(
    id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    envio = await controller.obtener_por_id(id)
    if envio.usuario_id != usuario.id:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver este envío"
        )
    
    return envio

@router.post(
    "/",
    response_model=RespuestaConMensaje[EnvioAdminResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def crear_envio(data: EnvioCreate):
    envio = await controller.crear(data)
    return RespuestaConMensaje(
        mensaje="Envío creado correctamente",
        data=envio
    )


@router.get(
    "/admin/all",
    response_model=Paginado[EnvioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_todos_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    envios, total = await controller.listar_todos(skip=skip, limit=limit)
    return Paginado(items=envios, total=total, skip=skip, limit=limit)


@router.get(
    "/admin/estado/{estado}",
    response_model=Paginado[EnvioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_por_estado_admin(
    estado: EstadoEnvioEnum,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    envios, total = await controller.listar_por_estado(
        estado=estado,
        skip=skip,
        limit=limit
    )
    return Paginado(items=envios, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/compra/{compra_id}",
    response_model=EnvioAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_envio_por_compra(compra_id: PydanticObjectId):
    return await controller.obtener_por_compra_id(compra_id)

@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[EnvioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_datos_envio(
    id: PydanticObjectId,
    data: EnvioUpdate,
):
    envio = await controller.actualizar_datos(id, data)
    return RespuestaConMensaje(
        mensaje="Envío actualizado correctamente",
        data=envio
    )

@router.patch(
    "/{id}/estado",
    response_model=RespuestaConMensaje[EnvioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_estado_envio(
    id: PydanticObjectId,
    data: EnvioEstadoUpdate,
):
    envio = await controller.actualizar_estado(id, data)
    return RespuestaConMensaje(
        mensaje=f"Estado del envío actualizado a '{data.estado.value}'",
        data=envio
    )