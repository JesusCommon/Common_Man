from uuid import UUID
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, Query
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.modules.usuarios.controller import UsuarioController
from src.modules.usuarios.document import Usuario
from src.modules.usuarios.schema import (
    UsuarioAdminResponse,
    UsuarioAdminUpdate,
    UsuarioCambiarPassword,
    UsuarioCreate,
    UsuarioPropioResponse,
    UsuarioPublicResponse,
    UsuarioRecargarSaldo,
    UsuarioUpdate,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado
from src.utils.indetificadores import resolver_identificador

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
controller = UsuarioController()

@router.post("/", response_model=RespuestaConMensaje[UsuarioPropioResponse], status_code=201)
async def crear(data: UsuarioCreate):
    usuario = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Usuario creado satisfactoriamente", data=usuario)

@router.get("/buscar", response_model=list[UsuarioPublicResponse])
async def buscar_personas(
    nombre: str | None = None,
    apellido: str | None = None,
    username: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    return await controller.buscar_personas(
        nombre=nombre, apellido=apellido, username=username, skip=skip, limit=limit
    )

@router.get("/me", response_model=UsuarioPropioResponse)
async def obtener_perfil_propio(usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    return usuario_actual

@router.put("/me", response_model=RespuestaConMensaje[UsuarioPropioResponse])
async def actualizar_mi_perfil(
    data: UsuarioUpdate,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    usuario = await controller.actualizar(usuario_actual.identificador, data)
    return RespuestaConMensaje(mensaje="Usuario actualizado correctamente", data=usuario)

@router.patch("/me/password", response_model=RespuestaConMensaje[UsuarioPropioResponse])
async def cambiar_mi_password(
    data: UsuarioCambiarPassword,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    usuario = await controller.cambiar_password(usuario_actual.identificador, data)
    return RespuestaConMensaje(mensaje="Contraseña actualizada correctamente", data=usuario)

@router.patch("/me/saldo", response_model=RespuestaConMensaje[UsuarioPropioResponse])
async def recargar_mi_saldo(
    data: UsuarioRecargarSaldo,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    usuario = await controller.recargar_saldo(usuario_actual.identificador, data)
    return RespuestaConMensaje(mensaje="Saldo recargado con éxito", data=usuario)

@router.get("/all", response_model=Paginado[UsuarioAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar(skip: int = 0, limit: int = 20):
    usuarios, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=usuarios, total=total, skip=skip, limit=limit)

@router.get("/inactivos", response_model=Paginado[UsuarioAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_inactivos(skip: int = 0, limit: int = 20):
    usuarios, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=usuarios, total=total, skip=skip, limit=limit)

@router.get("/activos", response_model=Paginado[UsuarioAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_activos(skip: int = 0, limit: int = 20):
    usuarios, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=usuarios, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/buscar",
    response_model=list[UsuarioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def buscar_por_filtro(
    nombre: str | None = None,
    apellido: str | None = None,
    username: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await controller.buscar_por_filtro(
        nombre=nombre, apellido=apellido, username=username, skip=skip, limit=limit
    )

@router.get(
    "/identificador/{identificador}",
    response_model=UsuarioAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_por_identificador(identificador: UUID):
    return await controller.obtener_por_identificador(identificador)

@router.get("/{id}", response_model=UsuarioAdminResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[UsuarioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_admin(id: PydanticObjectId, data: UsuarioAdminUpdate):
    usuario = await controller.actualizar_admin(id, data)
    return RespuestaConMensaje(mensaje="Usuario actualizado correctamente", data=usuario)

@router.patch(
    "/{identificador}/saldo",
    response_model=RespuestaConMensaje[UsuarioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def recargar_saldo_admin(
    data: UsuarioRecargarSaldo,
    identificador: PydanticObjectId | UUID = Depends(resolver_identificador),
):
    usuario = await controller.recargar_saldo_admin(identificador, data)
    return RespuestaConMensaje(mensaje="Saldo recargado con éxito", data=usuario)

@router.patch(
    "/{identificador}/saldo/restar",
    response_model=RespuestaConMensaje[UsuarioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def restar_saldo_admin(
    data: UsuarioRecargarSaldo,
    identificador: PydanticObjectId | UUID = Depends(resolver_identificador),
):
    usuario = await controller.restar_saldo_admin(identificador, data)
    return RespuestaConMensaje(mensaje="Saldo restado con éxito", data=usuario)

@router.patch(
    "/{id}/activar",
    response_model=RespuestaConMensaje[UsuarioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar(id: PydanticObjectId):
    usuario = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Usuario activado correctamente", data=usuario)

@router.patch(
    "/{id}/desactivar",
    response_model=RespuestaConMensaje[UsuarioAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar(id: PydanticObjectId):
    usuario = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Usuario desactivado correctamente", data=usuario)

