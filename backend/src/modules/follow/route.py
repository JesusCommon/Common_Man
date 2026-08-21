from fastapi import APIRouter, Depends, Query
from src.core.security.jwt import obtener_usuario_actual
from src.modules.follow.controller import FollowController
from src.modules.follow.schema import FollowCreate, FollowPublicResponse
from src.modules.usuarios.controller import UsuarioController
from src.modules.usuarios.document import Usuario
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/follows", tags=["Follows"])
controller = FollowController()
usuarios_controller = UsuarioController()

@router.post("/", response_model=RespuestaConMensaje[FollowPublicResponse], status_code=201)
async def seguir(
    data: FollowCreate,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    follow = await controller.seguir(usuario_actual, data)
    return RespuestaConMensaje(mensaje="Ahora sigues a este usuario", data=follow)

@router.delete("/{username}", response_model=RespuestaConMensaje[FollowPublicResponse])
async def dejar_de_seguir(
    username: str,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    follow = await controller.dejar_de_seguir(usuario_actual, username)
    return RespuestaConMensaje(mensaje="Dejaste de seguir a este usuario", data=follow)

@router.get("/me/seguidores", response_model=Paginado[FollowPublicResponse])
async def listar_mis_seguidores(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    seguidores, total = await controller.listar_seguidores(
        usuario_actual.id, skip=skip, limit=limit
    )
    return Paginado(items=seguidores, total=total, skip=skip, limit=limit)

@router.get("/me/seguidos", response_model=Paginado[FollowPublicResponse])
async def listar_mis_seguidos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    seguidos, total = await controller.listar_seguidos(
        usuario_actual.id, skip=skip, limit=limit
    )
    return Paginado(items=seguidos, total=total, skip=skip, limit=limit)

@router.get("/me/sigue-a/{username}", response_model=RespuestaConMensaje[bool])
async def sigue_a(
    username: str,
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
):
    seguido = await usuarios_controller.obtener_perfil_publico(username)
    relacion = await controller.obtener_relacion(usuario_actual.id, seguido.id)
    sigue = bool(relacion and relacion.activo)
    return RespuestaConMensaje(
        mensaje="Consulta realizada correctamente",
        data=sigue,
    )

@router.get("/perfil/{username}/seguidores", response_model=Paginado[FollowPublicResponse])
async def listar_seguidores_de(
    username: str,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    usuario = await usuarios_controller.obtener_perfil_publico(username)
    seguidores, total = await controller.listar_seguidores(
        usuario.id, skip=skip, limit=limit
    )
    return Paginado(items=seguidores, total=total, skip=skip, limit=limit)

@router.get("/perfil/{username}/seguidos", response_model=Paginado[FollowPublicResponse])
async def listar_seguidos_de(
    username: str,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    usuario = await usuarios_controller.obtener_perfil_publico(username)
    seguidos, total = await controller.listar_seguidos(
        usuario.id, skip=skip, limit=limit
    )
    return Paginado(items=seguidos, total=total, skip=skip, limit=limit)