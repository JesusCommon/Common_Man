from beanie import PydanticObjectId
from fastapi import APIRouter, Depends
from src.core.security.jwt import obtener_usuario_admin
from src.modules.categoriasProductos.controller import CategoriaController
from src.modules.categoriasProductos.schema import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriaResponse,
    CategoriaPublicaResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/categorias/productos", tags=["Categorias Productos"])
controller = CategoriaController()


@router.post("/", response_model=RespuestaConMensaje[CategoriaResponse], status_code=201)
async def crear(data: CategoriaCreate):
    categoria = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Categoria creada satisfactoriamente", data=categoria)


@router.get("/publicas", response_model=list[CategoriaPublicaResponse])
async def listar_publicas():
    categorias = await controller.listar_publicas()
    return [CategoriaPublicaResponse.from_categoria(c) for c in categorias]


@router.get("/all", response_model=Paginado[CategoriaResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar(skip: int = 0, limit: int = 20):
    categorias, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=categorias, total=total, skip=skip, limit=limit)


@router.get("/activas", response_model=Paginado[CategoriaResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_activas(skip: int = 0, limit: int = 20):
    categorias, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=categorias, total=total, skip=skip, limit=limit)


@router.get("/inactivas", response_model=Paginado[CategoriaResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_inactivas(skip: int = 0, limit: int = 20):
    categorias, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=categorias, total=total, skip=skip, limit=limit)


@router.get("/{id}", response_model=CategoriaResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)


@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[CategoriaResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar(id: PydanticObjectId, data: CategoriaUpdate):
    categoria = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Categoria actualizada correctamente", data=categoria)


@router.patch(
    "/{id}/activar",
    response_model=RespuestaConMensaje[CategoriaResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar(id: PydanticObjectId):
    categoria = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Categoria activada correctamente", data=categoria)


@router.patch(
    "/{id}/desactivar",
    response_model=RespuestaConMensaje[CategoriaResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar(id: PydanticObjectId):
    categoria = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Categoria desactivada correctamente", data=categoria)