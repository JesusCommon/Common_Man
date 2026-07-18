from fastapi import APIRouter, Query
from beanie import PydanticObjectId
from uuid import UUID
from app.schemas.usuarios_schema import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse,
    UsuarioCambiarPassword,
    UsuarioRecargarSaldo,
)
from app.schemas.common_schema import RespuestaConMensaje
from app.controllers.usuarios_controller import UsuarioController

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
controller = UsuarioController()


@router.post("/", response_model=RespuestaConMensaje[UsuarioResponse], status_code=201)
async def crear(data: UsuarioCreate):
    usuario = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Usuario creado satisfactoriamente", data=usuario)


@router.get("/all", response_model=list[UsuarioResponse])
async def listar():
    return await controller.listar()


@router.get("/inactivos", response_model=list[UsuarioResponse])
async def listar_inactivos():
    return await controller.listar_inactivos()


@router.get("/activos", response_model=list[UsuarioResponse])
async def listar_activos():
    return await controller.listar_activos()


@router.get("/buscar", response_model=list[UsuarioResponse])
async def buscar_por_filtro(
    nombre: str | None = None,
    apellido: str | None = None,
    username: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await controller.buscar_por_filtro(
        nombre=nombre,
        apellido=apellido,
        username=username,
        skip=skip,
        limit=limit,
    )


@router.get("/identificador/{identificador}", response_model=UsuarioResponse)
async def obtener_por_identificador(identificador: UUID):
    return await controller.obtener_por_identificador(identificador)


@router.get("/{id}", response_model=UsuarioResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)


@router.put("/{id}", response_model=RespuestaConMensaje[UsuarioResponse])
async def actualizar(id: PydanticObjectId, data: UsuarioUpdate):
    usuario = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Usuario actualizado correctamente", data=usuario)


@router.patch("/{id}/activar", response_model=RespuestaConMensaje[UsuarioResponse])
async def activar(id: PydanticObjectId):
    usuario = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Usuario activado correctamente", data=usuario)


@router.patch("/{id}/desactivar", response_model=RespuestaConMensaje[UsuarioResponse])
async def desactivar(id: PydanticObjectId):
    usuario = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Usuario desactivado correctamente", data=usuario)


@router.patch("/{id}/password", response_model=RespuestaConMensaje[UsuarioResponse])
async def cambiar_password(id: PydanticObjectId, data: UsuarioCambiarPassword):
    usuario = await controller.cambiar_password(id, data)
    return RespuestaConMensaje(mensaje="Contraseña actualizada correctamente", data=usuario)


@router.patch("/{id}/saldo", response_model=RespuestaConMensaje[UsuarioResponse])
async def recargar_saldo(id: PydanticObjectId, data: UsuarioRecargarSaldo):
    usuario = await controller.recargar_saldo(id, data)
    return RespuestaConMensaje(mensaje="Saldo recargado con éxito", data=usuario)