from beanie import PydanticObjectId
from fastapi import APIRouter, Depends
from src.core.security.jwt import obtener_usuario_admin
from src.modules.biblioteca.genero.controller import GeneroController
from src.modules.biblioteca.genero.schema import (
    GeneroCreate,
    GeneroUpdate,
    GeneroReponse,
    GeneroPublicResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/generos/libros", tags=["Generos Libro"])
controller = GeneroController()

@router.post("/", response_model=RespuestaConMensaje[GeneroReponse], status_code=201, dependencies=[Depends(obtener_usuario_admin)])
async def crear(data: GeneroCreate):
    genero = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Genero creado satisfactoriamente", data=genero)

@router.get("/publicos", response_model=list[GeneroPublicResponse])
async def listar_publicas():
    generos = await controller.listar_publicas()
    return [GeneroPublicResponse.from_genero(c) for c in generos]

@router.get("/all", response_model=Paginado[GeneroReponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar(skip: int = 0, limit: int = 20):
    generos, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=generos, total=total, skip=skip, limit=limit)

@router.get("/activos", response_model=Paginado[GeneroReponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_activas(skip: int = 0, limit: int = 20):
    generos, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=generos, total=total, skip=skip, limit=limit)

@router.get("/inactivos", response_model=Paginado[GeneroReponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_inactivas(skip: int = 0, limit: int = 20):
    generos, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=generos, total=total, skip=skip, limit=limit)

@router.get("/{id}", response_model=GeneroReponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[GeneroReponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar(id: PydanticObjectId, data: GeneroUpdate):
    genero = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Genero actualizado correctamente", data=genero)

@router.patch(
    "/{id}/activar",
    response_model=RespuestaConMensaje[GeneroReponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar(id: PydanticObjectId):
    genero = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Genero activado correctamente", data=genero)

@router.patch(
    "/{id}/desactivar",
    response_model=RespuestaConMensaje[GeneroReponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar(id: PydanticObjectId):
    genero = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Genero desactivado correctamente", data=genero)