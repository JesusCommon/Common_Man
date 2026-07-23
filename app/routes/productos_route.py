from fastapi import APIRouter, Query
from beanie import PydanticObjectId
from app.schemas.productos_schema import (
    ProductoResponse,
    ProductoCreate,
    ProductoUpdate
)
from app.controllers.productos_controller import ProductoController
from app.schemas.common_schema import RespuestaConMensaje
from uuid import UUID

router = APIRouter(prefix="/productos", tags=["Productos"])
controller = ProductoController()

@router.post("/", response_model=RespuestaConMensaje[ProductoResponse], status_code=201)
async def crear(data: ProductoCreate):
    producto = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Producto creado satisfactoriamente", data=producto)

@router.get("/all", response_model=list[ProductoResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[ProductoResponse])
async def listar_activos():
    return await controller.listar_activos()

@router.get("/{id}", response_model=ProductoResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put("/{id}", response_model=RespuestaConMensaje[ProductoResponse])
async def actualizar(id: PydanticObjectId, data: ProductoUpdate):
    producto = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Producto actualizado satisfactoriamente", data=producto)

@router.patch("/{id}/activar", response_model=RespuestaConMensaje[ProductoResponse])
async def activar(id: PydanticObjectId):
    producto = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Producto activado satisfactoriamente", data=producto)

@router.patch("/{id}/desactivar", response_model=RespuestaConMensaje[ProductoResponse])
async def desactivar(id: PydanticObjectId):
    producto = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Producto desactivado satisfactoriamente", data=producto)

@router.get("/buscar", response_model=list[ProductoResponse])
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

@router.get("/identificador/{identificador}", response_model=ProductoResponse)
async def obtener_por_identificador(identificador: UUID):
    return await controller.obtener_por_identificador(identificador)
