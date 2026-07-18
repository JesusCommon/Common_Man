from fastapi import APIRouter, Query
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

@router.get("/buscar", response_model=list[LibroResponse])
async def buscar_por_filtro(
    nombre: str | None = None,
    categoria_id: PydanticObjectId | None = None,
    precio_min: float | None = None,
    precio_max: float | None = None,
    idioma: str | None = None,
    anio_publicacion: int | None = None,
    autor: str | None = None,
    editorial: str | None = None,
    ordenar_por: str = "fecha_creacion",
    orden_desc: bool = True,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await controller.buscar_con_filtro(
        nombre=nombre,
        categoria_id=categoria_id,
        precio_min=precio_min,
        precio_max=precio_max,
        idioma=idioma,
        anio_publicacion=anio_publicacion,
        autor=autor,
        editorial=editorial,
        orden_por=ordenar_por,
        orden_desc=orden_desc,
        skip=skip,
        limit=limit,
    )
