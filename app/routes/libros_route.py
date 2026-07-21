from fastapi import APIRouter, Query
from beanie import PydanticObjectId
from app.schemas.libros_schema import (
    LibroResponse,
    LibroUpdate,
    LibroCreate
)
from app.controllers.libros_controller import LibroController
from app.schemas.common_schema import RespuestaConMensaje

router = APIRouter(prefix="/libros", tags=["Libros"])
controller = LibroController()

@router.post("/", response_model=RespuestaConMensaje[LibroResponse], status_code=201)
async def crear(data: LibroCreate):
    libro = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Libro creado satisfactoriamente", data=libro)

@router.get("/all", response_model=list[LibroResponse])
async def listar():
    return await controller.listar()

@router.get("/activos", response_model=list[LibroResponse])
async def listar_activos():
    return await controller.listar_activos()

@router.get("/{id}", response_model=LibroResponse)
async def obtener_id(id: PydanticObjectId):
    return await controller.obtener_id(id)

@router.put("/{id}", response_model=RespuestaConMensaje[LibroResponse])
async def actualizar(id: PydanticObjectId, data: LibroUpdate):
    libro = await controller.actualizar(id, data)
    return RespuestaConMensaje(mensaje="Libro actualizado satisfactoriamente", data=libro)

@router.patch("/{id}/activar", response_model=RespuestaConMensaje[LibroResponse])
async def activar(id: PydanticObjectId):
    libro = await controller.activar(id)
    return RespuestaConMensaje(mensaje="Libro activado satisfactoriamente", data=libro)

@router.patch("/{id}/desactivar", response_model=RespuestaConMensaje[LibroResponse])
async def desactivar(id: PydanticObjectId):
    libro = await controller.desactivar(id)
    return RespuestaConMensaje(mensaje="Libro desactivado satisfactoriamente", data=libro)

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
