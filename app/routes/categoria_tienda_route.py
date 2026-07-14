from fastapi import APIRouter
from beanie import PydanticObjectId
from app.schemas.categoria_tienda_schema import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriaResponse
)
from app.controllers.categoria_tienda_controller import CategoriaController

router = APIRouter(prefix="/categorias_tienda", tags=["Categorias Tienda"])
controller = CategoriaController()

@router.post("/", response_model=CategoriaResponse, status_code=201)
async def crear(data: CategoriaCreate):
    return await controller.crear(data)

@router.get("/all", response_model=list[CategoriaResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[CategoriaResponse])
async def listar_activos():
    return await controller.listar_activos()


@router.get("/{id}", response_model=CategoriaResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)


@router.put("/{id}", response_model=CategoriaResponse)
async def actualizar(id: PydanticObjectId, data: CategoriaUpdate):
    return await controller.actualizar(id, data)


@router.patch("/{id}/activar", response_model=CategoriaResponse)
async def activar(id: PydanticObjectId):
    return await controller.activar(id)


@router.patch("/{id}/desactivar", response_model=CategoriaResponse)
async def desactivar(id: PydanticObjectId):
    return await controller.desactivar(id)
