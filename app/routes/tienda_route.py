from fastapi import APIRouter, Query
from beanie import PydanticObjectId
from app.schemas.tienda_schema import (
    TiendaResponse,
    TiendaUpdate,
    TiendaCreate
)
from app.controllers.tienda_controller import TiendaController
from uuid import UUID

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

@router.get("/buscar", response_model=list[TiendaResponse])
async def buscar_por_filtro(
    nombre: str | None = None,
    categoria_id: PydanticObjectId | None = None,
    precio_min: float | None = None,
    precio_max: float | None = None,
    disponible: bool | None = None,
    ordenar_por: str = "fecha_creacion",
    orden_desc: bool = True,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await controller.buscar_por_filtro(
        nombre=nombre,
        categoria_id=categoria_id,
        precio_min=precio_min,
        precio_max=precio_max,
        disponible=disponible,
        ordenar_por=ordenar_por,
        orden_desc=orden_desc,
        skip=skip,
        limit=limit,
    )

@router.get("/identificador/{identificador}", response_model=TiendaResponse)
async def obtener_por_identificador(identificador: UUID):
    return await controller.obtener_por_identificador(identificador)
