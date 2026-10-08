from decimal import Decimal
from typing import Any
from fastapi import APIRouter, UploadFile, File, Depends, Query
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
    AutorDestacadoResponse,
    LibroLecturaResponse
)
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/libros", tags=["Libros"])
controller = LibroController()

@router.get("/", response_model=Paginado[LibroResponse], dependencies=[Depends(obtener_usuario_actual)])
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
    "/autores/destacados",
    response_model=list[AutorDestacadoResponse],
)
async def autores_destacados(limit: int = Query(default=6, ge=1, le=20)):
    return await controller.autores_destacados(limit=limit)

@router.get(
    "/mis-libros",
    response_model=list[LibroResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def mis_libros(usuario=Depends(obtener_usuario_actual)):
    return await controller.mis_libros(usuario.id)

@router.get("/all", response_model=Paginado[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_libros(skip: int = 0, limit: int = 20):
    libros, total = await controller.listar(skip=skip, limit=limit)
    return Paginado(items=libros, total=total, skip=skip, limit=limit)

@router.get("/activos", response_model=Paginado[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_libros_activos(skip: int = 0, limit: int = 20):
    libros, total = await controller.listar_activos(skip=skip, limit=limit)
    return Paginado(items=libros, total=total, skip=skip, limit=limit)

@router.get("/inactivos", response_model=Paginado[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def listar_libros_inactivos(skip: int = 0, limit: int = 20):
    libros, total = await controller.listar_inactivos(skip=skip, limit=limit)
    return Paginado(items=libros, total=total, skip=skip, limit=limit)

@router.get("/admin/all", response_model=Paginado[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
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

@router.get("/admin/isbn/{isbn}", response_model=LibroAdminResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_libro_por_isbn(isbn: str):
    return await controller.obtener_por_isbn(isbn)

@router.get("/admin/sku/{sku}", response_model=LibroAdminResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_libro_por_sku(sku: str):
    return await controller.obtener_por_sku(sku)

@router.get("/admin/{libro_id}", response_model=LibroAdminResponse, dependencies=[Depends(obtener_usuario_admin)])
async def obtener_libro_admin(libro_id: PydanticObjectId):
    return await controller.obtener_por_id(libro_id)

@router.get("/{libro_id}", response_model=LibroResponse, dependencies=[Depends(obtener_usuario_actual)])
async def obtener_libro(libro_id: PydanticObjectId):
    return await controller.obtener_por_id(libro_id)

@router.get("/{libro_id}/contenido", response_model=LibroContenidoResponse)
async def obtener_contenido_libro(
    libro_id: PydanticObjectId,
    usuario: Any = Depends(obtener_usuario_actual),
):
    return await controller.obtener_contenido(libro_id, usuario)

@router.post("/{libro_id}/archivo", response_model=RespuestaConMensaje[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def subir_archivo_libro(
    libro_id: PydanticObjectId,
    pdf: UploadFile = File(..., description="Archivo PDF del libro"),
):
    libro = await controller.subir_archivo(libro_id, pdf)
    return RespuestaConMensaje(mensaje="Archivo PDF subido correctamente",data=libro)

@router.get("/{libro_id}/lector", response_model=LibroLecturaResponse, dependencies=[Depends(obtener_usuario_actual)])
async def preparar_libro_para_lectura(
    libro_id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    resultado = await controller.preparar_lectura(libro_id, usuario)
    return LibroLecturaResponse(**resultado)

@router.post("/", response_model=RespuestaConMensaje[LibroAdminResponse], status_code=201, dependencies=[Depends(obtener_usuario_admin)])
async def crear_libro(payload: LibroCreate):
    libro = await controller.crear(payload)
    return RespuestaConMensaje(mensaje="Libro creado correctamente", data=libro)

@router.patch("/{libro_id}", response_model=RespuestaConMensaje[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def actualizar_libro(libro_id: PydanticObjectId, payload: LibroUpdate):
    libro = await controller.actualizar(libro_id, payload)
    return RespuestaConMensaje(mensaje="Libro actualizado correctamente", data=libro)

@router.patch("/{libro_id}/activar", response_model=RespuestaConMensaje[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def activar_libro(libro_id: PydanticObjectId):
    libro = await controller.activar(libro_id)
    return RespuestaConMensaje(mensaje="Libro activado correctamente", data=libro)

@router.patch("/{libro_id}/desactivar", response_model=RespuestaConMensaje[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def desactivar_libro(libro_id: PydanticObjectId):
    libro = await controller.desactivar(libro_id)
    return RespuestaConMensaje(mensaje="Libro desactivado correctamente", data=libro)

@router.patch("/{id}/imagen", response_model=RespuestaConMensaje[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def actualizar_imagen_libro(id: PydanticObjectId, imagen: UploadFile = File(..., description="Imagen del libro")):
    libro = await controller.actualizar_imagen(id, imagen)
    return RespuestaConMensaje(mensaje="Imagen del libro actualizada correctamente", data=libro)

@router.delete("/{id}/imagen", response_model=RespuestaConMensaje[LibroAdminResponse], dependencies=[Depends(obtener_usuario_admin)])
async def eliminar_imagen_libro(id: PydanticObjectId):
    libro = await controller.eliminar_imagen(id)
    return RespuestaConMensaje(mensaje="Imagen del libro eliminada correctamente", data=libro)