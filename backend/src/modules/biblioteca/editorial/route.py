from beanie import PydanticObjectId
from fastapi import APIRouter, Depends
from src.core.security.jwt import obtener_usuario_admin
from src.modules.biblioteca.editorial.controller import EditorialController
from src.modules.biblioteca.editorial.schema import (
    EditorialCreate,
    EditorialUpdate,
    EditorialResponse,
    EditorialPublicResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/editorial/libros", tags=["Editoriales Libro"])
controller = EditorialController()

@router.post("/", response_model=RespuestaConMensaje[EditorialResponse], status_code=201, dependencies=[Depends(obtener_usuario_admin)])
async def crear(data: EditorialCreate):
    editorial = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Editorial creado satisfactoriamente", data=editorial)

@router.get("/publicos", response_model=list[EditorialPublicResponse])
async def listar_publicas():
    editoriales = await controller.listar_publicas()
    return [EditorialPublicResponse.from_editorial(c) for c in editoriales]

@router.get("/all", response_model=Paginado[EditorialResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar(skip: int = 0, limit: int = 20):
    editoriales, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=editoriales, total=total, skip=skip, limit=limit)

@router.get("/activos", response_model=Paginado[EditorialResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_activas(skip: int = 0, limit: int = 20):
    editoriales, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=editoriales, total=total, skip=skip, limit=limit)

@router.get("/inactivos", response_model=Paginado[EditorialResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_inactivas(skip: int = 0, limit: int = 20):
    editoriales, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=editoriales, total=total, skip=skip, limit=limit)

@router.get("/{id}", response_model=EditorialResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[EditorialResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar(id: PydanticObjectId, data: EditorialUpdate):
    editorial = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Editorial actualizada correctamente", data=editorial)

@router.patch(
    "/{id}/activar",
    response_model=RespuestaConMensaje[EditorialResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar(id: PydanticObjectId):
    editorial = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Editorial activada correctamente", data=editorial)

@router.patch(
    "/{id}/desactivar",
    response_model=RespuestaConMensaje[EditorialResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar(id: PydanticObjectId):
    editorial = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="editorial desactivada correctamente", data=editorial)