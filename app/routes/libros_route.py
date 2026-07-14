from fastapi import APIRouter
from beanie import PydanticObjectId
from app.schemas.libros_schema import (
    LibroResponse,
    LibroUpdate,
    LibroCreate
)
from app.controllers.libros_controller import LibroController

router = APIRouter(prefix="/libros", tags=["Libros"])
controller = LibroController()

@router.post("/", response_model=LibroResponse, status_code=201)
async def crear(data: LibroCreate):
    return await controller.crear(data)

@router.get("/all", response_model=list[LibroResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[LibroResponse])
async def listar_activos():
    return await controller.listar_activos()


@router.get("/{id}", response_model=LibroResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)


@router.put("/{id}", response_model=LibroResponse)
async def actualizar(id: PydanticObjectId, data: LibroUpdate):
    return await controller.actualizar(id, data)


@router.patch("/{id}/activar", response_model=LibroResponse)
async def activar(id: PydanticObjectId):
    return await controller.activar(id)


@router.patch("/{id}/desactivar", response_model=LibroResponse)
async def desactivar(id: PydanticObjectId):
    return await controller.desactivar(id)
