from fastapi import APIRouter
from beanie import PydanticObjectId
from app.schemas.categorias_libros_schema import (
    CategoriaCreate,
    CategoriaUpdate,
    CategoriasResponse
)
from app.controllers.categoria_libro_controller import CategoriaController

router = APIRouter(prefix="/categorias", tags=["Categorias"])
controller = CategoriaController()

@router.post("/", response_model=CategoriasResponse, status_code=201)
async def crear(data: CategoriaCreate):
    return await controller.crear(data)

@router.get("/all", response_model=list[CategoriasResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[CategoriasResponse])
async def listar_activos():
    return await controller.listar_activos()


@router.get("/{id}", response_model=CategoriasResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)


@router.put("/{id}", response_model=CategoriasResponse)
async def actualizar(id: PydanticObjectId, data: CategoriaUpdate):
    return await controller.actualizar(id, data)


@router.patch("/{id}/activar", response_model=CategoriasResponse)
async def activar(id: PydanticObjectId):
    return await controller.activar(id)


@router.patch("/{id}/desactivar", response_model=CategoriasResponse)
async def desactivar(id: PydanticObjectId):
    return await controller.desactivar(id)
