from beanie import PydanticObjectId
from fastapi import APIRouter, Depends
from src.core.security.jwt import obtener_usuario_admin
from src.modules.biblioteca.autor.controller import AutorController
from src.modules.biblioteca.autor.schema import (
    AutorCreate,
    AutorUpdate,
    AutorResponse,
    AutorPublicResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/autor/libros", tags=["Autores Libro"])
controller = AutorController()

@router.post("/", response_model=RespuestaConMensaje[AutorResponse], status_code=201, dependencies=[Depends(obtener_usuario_admin)])
async def crear(data: AutorCreate):
    autor = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Autor/a creado/a satisfactoriamente", data=autor)

@router.get("/publicos", response_model=list[AutorPublicResponse])
async def listar_publicas():
    autores = await controller.listar_publicas()
    return [AutorPublicResponse.from_autor(c) for c in autores]

@router.get("/all", response_model=Paginado[AutorResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar(skip: int = 0, limit: int = 20):
    autores, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=autores, total=total, skip=skip, limit=limit)

@router.get("/activos", response_model=Paginado[AutorResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_activas(skip: int = 0, limit: int = 20):
    autores, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=autores, total=total, skip=skip, limit=limit)

@router.get("/inactivos", response_model=Paginado[AutorResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_inactivas(skip: int = 0, limit: int = 20):
    autores, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=autores, total=total, skip=skip, limit=limit)

@router.get("/{id}", response_model=AutorResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[AutorResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar(id: PydanticObjectId, data: AutorUpdate):
    autor = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Autor/a actualizado/a correctamente", data=autor)

@router.patch(
    "/{id}/activar",
    response_model=RespuestaConMensaje[AutorResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar(id: PydanticObjectId):
    autor = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Autor/a activado/a correctamente", data=autor)

@router.patch(
    "/{id}/desactivar",
    response_model=RespuestaConMensaje[AutorResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar(id: PydanticObjectId):
    autor = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="autor/a desactivado/a correctamente", data=autor)