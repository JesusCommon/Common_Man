from decimal import Decimal
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, Query
from src.core.security.jwt import obtener_usuario_admin 
from src.modules.productos.controller import ProductoController
from src.modules.productos.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoPublicResponse,
    ProductoAdminResponse,
    ProductoStockUpdate,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/productos", tags=["Productos"])
controller = ProductoController()

@router.get("/", response_model=Paginado[ProductoPublicResponse])
async def listar_productos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    productos, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=productos, total=total, skip=skip, limit=limit)

@router.get("/buscar", response_model=Paginado[ProductoPublicResponse])
async def buscar_productos(
    nombre: str | None = None,
    categoria_id: PydanticObjectId | None = None,
    precio_min: Decimal | None = None,
    precio_max: Decimal | None = None,
    stock_min: int | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    productos, total = await controller.buscar_por_filtro(
        nombre=nombre,
        categoria_id=categoria_id,
        precio_min=precio_min,
        precio_max=precio_max,
        stock_min=stock_min,
        solo_activos=True,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=productos, total=total, skip=skip, limit=limit)

@router.get("/recientes", response_model=list[ProductoPublicResponse])
async def obtener_recientes(
    limit: int = Query(default=10, ge=1, le=50),
):
    return await controller.obtener_recientes(limit=limit)

@router.get("/categoria/{categoria_id}", response_model=Paginado[ProductoPublicResponse])
async def listar_por_categoria(
    categoria_id: PydanticObjectId,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    productos, total = await controller.listar_por_categoria(
        categoria_id=categoria_id,
        skip=skip,
        limit=limit,
        solo_activos=True,
    )
    return Paginado(items=productos, total=total, skip=skip, limit=limit)

@router.get("/{slug}", response_model=ProductoPublicResponse)
async def obtener_por_slug(slug: str):
    return await controller.obtener_por_slug(slug)

@router.post(
    "/",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def crear_producto(data: ProductoCreate):
    producto = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Producto creado satisfactoriamente", data=producto)

@router.get(
    "/admin/all",
    response_model=Paginado[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_todos_admin(skip: int = 0, limit: int = 20):
    productos, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=productos, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/activos",
    response_model=Paginado[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_activos_admin(skip: int = 0, limit: int = 20):
    productos, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=productos, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/inactivos",
    response_model=Paginado[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_inactivos_admin(skip: int = 0, limit: int = 20):
    productos, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=productos, total=total, skip=skip, limit=limit)

@router.get(
    "/admin/{id}",
    response_model=ProductoAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_por_id_admin(id: PydanticObjectId):
    return await controller.obtener_por_id(id)

@router.put(
    "/{id}",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_producto(id: PydanticObjectId, data: ProductoUpdate):
    producto = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Producto actualizado correctamente", data=producto)

@router.patch(
    "/{id}/stock",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_stock(id: PydanticObjectId, data: ProductoStockUpdate):
    producto = await controller.actualizar_stock(id, data.delta)
    return RespuestaConMensaje(mensaje="Stock actualizado correctamente", data=producto)

@router.patch(
    "/{id}/stock/descontar",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def descontar_stock(id: PydanticObjectId, data: ProductoStockUpdate):
    producto = await controller.descontar_stock(id, abs(data.delta))
    return RespuestaConMensaje(mensaje="Stock descontado correctamente", data=producto)

@router.patch(
    "/{id}/stock/establecer",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def establecer_stock(id: PydanticObjectId, data: ProductoStockUpdate):
    producto = await controller.establecer_stock(id, data.delta)
    return RespuestaConMensaje(mensaje="Stock establecido correctamente", data=producto)

@router.patch(
    "/{id}/activar",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar_producto(id: PydanticObjectId):
    producto = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Producto activado correctamente", data=producto)

@router.patch(
    "/{id}/desactivar",
    response_model=RespuestaConMensaje[ProductoAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar_producto(id: PydanticObjectId):
    producto = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Producto desactivado correctamente", data=producto)