from fastapi import APIRouter, Depends
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_admin
from src.modules.categorias_libro.controller import CategoriaLibroController
from src.modules.categorias_libro.schema import (
    CategoriaLibroCreate,
    CategoriaLibroUpdate,
    CategoriaLibroResponse,
)
from src.shared.common_schema import RespuestaConMensaje

router = APIRouter(
    prefix="/categoria_libro",
    tags=["Categorias Libros"],
    dependencies=[Depends(obtener_usuario_admin)],
)
controller = CategoriaLibroController()

@router.post("/", response_model=RespuestaConMensaje[CategoriaLibroResponse], status_code=201)
async def crear(data: CategoriaLibroCreate):
    categoria = await controller.crear(data)
    return RespuestaConMensaje(
        mensaje="Categoría creada satisfactoriamente",
        data=categoria,
    )

@router.get("/all", response_model=list[CategoriaLibroResponse])
async def listar():
    return await controller.listar()

@router.get("/activas", response_model=list[CategoriaLibroResponse])
async def listar_activas():
    return await controller.listar_activos()

@router.get("/{id}", response_model=CategoriaLibroResponse)
async def obtener_por_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put("/{id}", response_model=RespuestaConMensaje[CategoriaLibroResponse])
async def actualizar(id: PydanticObjectId, data: CategoriaLibroUpdate):
    categoria = await controller.actualizar(id, data)
    return RespuestaConMensaje(
        mensaje="Categoría actualizada satisfactoriamente",
        data=categoria,
    )

@router.patch("/{id}/activar", response_model=RespuestaConMensaje[CategoriaLibroResponse])
async def activar(id: PydanticObjectId):
    categoria = await controller.activar(id)
    return RespuestaConMensaje(
        mensaje="Categoría activada satisfactoriamente",
        data=categoria,
    )

@router.patch("/{id}/desactivar", response_model=RespuestaConMensaje[CategoriaLibroResponse])
async def desactivar(id: PydanticObjectId):
    categoria = await controller.desactivar(id)
    return RespuestaConMensaje(
        mensaje="Categoría desactivada satisfactoriamente",
        data=categoria,
    )