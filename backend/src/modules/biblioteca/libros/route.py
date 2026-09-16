from decimal import Decimal
from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.modules.biblioteca.libros.controller import LibroController
from src.modules.biblioteca.libros.document import Idiomas
from src.modules.biblioteca.libros.schema import (
    LibroCreate,
    LibroUpdate,
    LibroResponse,
    LibroAdminResponse,
    LibroContenidoResponse,
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/libros", tags=["Libros"])
controller = LibroController()


# ========== CATÁLOGO (USUARIO) ==========

@router.get(
    "/",
    response_model=Paginado[LibroResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def buscar_libros(
    nombre: str | None = Query(default=None, description="Búsqueda parcial por nombre"),
    autor_id: PydanticObjectId | None = Query(default=None),
    editorial_id: PydanticObjectId | None = Query(default=None),
    genero_id: PydanticObjectId | None = Query(default=None),
    idioma: Idiomas | None = Query(default=None),
    anio_desde: int | None = Query(default=None, ge=1000, le=2100),
    anio_hasta: int | None = Query(default=None, ge=1000, le=2100),
    precio_min: Decimal | None = Query(default=None, ge=0),
    precio_max: Decimal | None = Query(default=None, ge=0),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    """Catálogo de libros con filtros (solo activos, sin contenido)"""
    libros, total = await controller.buscar(
        nombre=nombre,
        autor_id=autor_id,
        editorial_id=editorial_id,
        genero_id=genero_id,
        idioma=idioma,
        anio_desde=anio_desde,
        anio_hasta=anio_hasta,
        precio_min=precio_min,
        precio_max=precio_max,
        solo_activos=True,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=libros, total=total, skip=skip, limit=limit)


@router.get(
    "/{libro_id}",
    response_model=LibroResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_libro(libro_id: PydanticObjectId):
    """Detalle público de un libro (sin contenido)"""
    return await controller.obtener_por_id(libro_id)


@router.get(
    "/{libro_id}/contenido",
    response_model=LibroContenidoResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_contenido_libro(
    libro_id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    """
    🔒 Recurso protegido: devuelve la URL del contenido
    solo si el usuario pagó el libro (o es admin)
    """
    return await controller.obtener_contenido(libro_id, usuario)


# ========== ADMINISTRACIÓN ==========

@router.get(
    "/admin/all",
    response_model=Paginado[LibroAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_libros_admin(
    nombre: str | None = Query(default=None),
    autor_id: PydanticObjectId | None = Query(default=None),
    editorial_id: PydanticObjectId | None = Query(default=None),
    genero_id: PydanticObjectId | None = Query(default=None),
    idioma: Idiomas | None = Query(default=None),
    solo_activos: bool = Query(default=False, description="False incluye inactivos"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    """Listado de administración (incluye inactivos y contenido)"""
    libros, total = await controller.buscar(
        nombre=nombre,
        autor_id=autor_id,
        editorial_id=editorial_id,
        genero_id=genero_id,
        idioma=idioma,
        solo_activos=solo_activos,
        skip=skip,
        limit=limit,
    )
    return Paginado(items=libros, total=total, skip=skip, limit=limit)


@router.get(
    "/admin/isbn/{isbn}",
    response_model=LibroAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_libro_por_isbn(isbn: str):
    """Busca un libro por su ISBN"""
    return await controller.obtener_por_isbn(isbn)


@router.get(
    "/admin/sku/{sku}",
    response_model=LibroAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_libro_por_sku(sku: str):
    """Busca un libro por su SKU"""
    return await controller.obtener_por_sku(sku)


@router.get(
    "/admin/{libro_id}",
    response_model=LibroAdminResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_libro_admin(libro_id: PydanticObjectId):
    """Detalle de administración (incluye contenido)"""
    return await controller.obtener_por_id(libro_id)


@router.post(
    "/",
    response_model=RespuestaConMensaje[LibroAdminResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def crear_libro(data: LibroCreate):
    """Crea un libro validando unicidad y relaciones"""
    libro = await controller.crear(data)
    return RespuestaConMensaje(mensaje="Libro creado correctamente", data=libro)


@router.patch(
    "/{libro_id}",
    response_model=RespuestaConMensaje[LibroAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def actualizar_libro(libro_id: PydanticObjectId, data: LibroUpdate):
    """Actualización parcial con re-validación de unicidad"""
    libro = await controller.actualizar(libro_id, data)
    return RespuestaConMensaje(mensaje="Libro actualizado correctamente", data=libro)


@router.patch(
    "/{libro_id}/activar",
    response_model=RespuestaConMensaje[LibroAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def activar_libro(libro_id: PydanticObjectId):
    """Reactiva un libro en el catálogo"""
    libro = await controller.activar(libro_id)
    return RespuestaConMensaje(mensaje="Libro activado correctamente", data=libro)


@router.patch(
    "/{libro_id}/desactivar",
    response_model=RespuestaConMensaje[LibroAdminResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def desactivar_libro(libro_id: PydanticObjectId):
    """Da de baja un libro sin eliminarlo"""
    libro = await controller.desactivar(libro_id)
    return RespuestaConMensaje(mensaje="Libro desactivado correctamente", data=libro)