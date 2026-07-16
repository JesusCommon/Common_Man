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
from app.controllers.usuarios_controller import UsuarioController

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
controller = UsuarioController()

@router.post("/", response_model=UsuarioResponse, status_code=201)
async def crear(data: UsuarioCreate):
    return await controller.crear(data)


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


@router.put("/{id}", response_model=UsuarioResponse)
async def actualizar(id: PydanticObjectId, data: UsuarioUpdate):
    return await controller.actualizar(id, data)


@router.patch("/{id}/activar", response_model=UsuarioResponse)
async def activar(id: PydanticObjectId):
    return await controller.activar(id)


@router.patch("/{id}/desactivar", response_model=UsuarioResponse)
async def desactivar(id: PydanticObjectId):
    return await controller.desactivar(id)


@router.patch("/{id}/password", response_model=UsuarioResponse)
async def cambiar_password(id: PydanticObjectId, data: UsuarioCambiarPassword):
    return await controller.cambiar_password(id, data)


@router.patch("/{id}/saldo", response_model=UsuarioResponse)
async def recargar_saldo(id: PydanticObjectId, data: UsuarioRecargarSaldo):
    return await controller.recargar_saldo(id, data)