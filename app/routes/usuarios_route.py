from fastapi import APIRouter, Query, Depends
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
from app.models.usuarios_model import Usuario
from app.core.security import obtener_usuario_actual

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

@router.put("/me", response_model=RespuestaConMensaje[UsuarioResponse])
async def actualizar_mi_perfil(
    data: UsuarioUpdate,
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    usuario = await controller.actualizar(usuario_actual.id, data)
    return RespuestaConMensaje(mensaje="Usuario actualizado correctamente", data=usuario)

@router.patch("/me/password", response_model=RespuestaConMensaje[UsuarioResponse])
async def cambiar_mi_password(
    data: UsuarioCambiarPassword,
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    usuario = await controller.cambiar_password(usuario_actual.id, data)
    return RespuestaConMensaje(mensaje="Contraseña actualizada correctamente", data=usuario)

@router.patch("/me/saldo", response_model=RespuestaConMensaje[UsuarioResponse])
async def recargar_mi_saldo(
    data: UsuarioRecargarSaldo,
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    usuario = await controller.recargar_saldo(usuario_actual.id, data)
    return RespuestaConMensaje(mensaje="Saldo recargado con éxito", data=usuario)

@router.get("/{id}", response_model=UsuarioResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.patch("/{id}/activar", response_model=RespuestaConMensaje[UsuarioResponse])
async def activar(id: PydanticObjectId):
    usuario = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Usuario activado correctamente", data=usuario)

@router.patch("/{id}/desactivar", response_model=RespuestaConMensaje[UsuarioResponse])
async def desactivar(id: PydanticObjectId):
    usuario = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Usuario desactivado correctamente", data=usuario)