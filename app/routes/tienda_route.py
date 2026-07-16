from fastapi import APIRouter
from beanie import PydanticObjectId
from app.schemas.tienda_schema import (
    TiendaResponse,
    TiendaUpdate,
    TiendaCreate
)
from app.controllers.tienda_controller import TiendaController

router = APIRouter(prefix="/productos", tags=["Productos"])
controller = TiendaController()

@router.post("/", response_model=TiendaResponse, status_code=201)
async def crear(data: TiendaCreate):
    return await controller.crear(data)

@router.get("/all", response_model=list[TiendaResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[TiendaResponse])
async def listar_activos():
    return await controller.listar_activos()


@router.get("/{id}", response_model=TiendaResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)


@router.put("/{id}", response_model=TiendaResponse)
async def actualizar(id: PydanticObjectId, data: TiendaUpdate):
    return await controller.actualizar(id, data)


@router.patch("/{id}/activar", response_model=TiendaResponse)
async def activar(id: PydanticObjectId):
    return await controller.activar(id)


@router.patch("/{id}/desactivar", response_model=TiendaResponse)
async def desactivar(id: PydanticObjectId):
    return await controller.desactivar(id)
