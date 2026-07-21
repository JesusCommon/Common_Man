from fastapi import APIRouter
from beanie import PydanticObjectId
from app.schemas.categoria_tienda_schema import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriaResponse
)
from app.controllers.categoria_tienda_controller import CategoriaController
from app.schemas.common_schema import RespuestaConMensaje

router = APIRouter(prefix="/categorias_tienda", tags=["Categorias Tienda"])
controller = CategoriaController()

@router.post("/", response_model=RespuestaConMensaje[CategoriaResponse], status_code=201)
async def crear(data: CategoriaCreate):
    categoria = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Categoria creada satisfactoriamente", data=categoria)

@router.get("/all", response_model=list[CategoriaResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[CategoriaResponse])
async def listar_activos():
    return await controller.listar_activos()

@router.get("/{id}", response_model=CategoriaResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put("/{id}", response_model=RespuestaConMensaje[CategoriaResponse])
async def actualizar(id: PydanticObjectId, data: CategoriaUpdate):
    categoria = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Categoria actualizada satisfactoriamente", data=categoria)

@router.patch("/{id}/activar", response_model=RespuestaConMensaje[CategoriaResponse])
async def activar(id: PydanticObjectId):
    categoria = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Categoria activada satisfactoriamente", data=categoria)

@router.patch("/{id}/desactivar", response_model=RespuestaConMensaje[CategoriaResponse])
async def desactivar(id: PydanticObjectId):
    categoria = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Categoria desactivada satisfactoriamente", data=categoria)