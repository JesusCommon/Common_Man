from fastapi import APIRouter, Depends
from app.schemas.compra_libro_schema import CompraLibroCreate, CompraLibroResponse
from app.schemas.common_schema import RespuestaConMensaje
from app.controllers.compra_libro_controller import CompraLibroController
from app.models.usuarios_model import Usuario
from app.core.security import obtener_usuario_actual

router = APIRouter(prefix="/compras-libros", tags=["Compras Libros"])
controller = CompraLibroController()

@router.post("/", response_model=RespuestaConMensaje[CompraLibroResponse], status_code=201)
async def comprar(
    data: CompraLibroCreate,
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    compra = await controller.comprar(usuario_actual.id, data.libro_id)
    return RespuestaConMensaje(mensaje="Compra realizada satisfactoriamente", data=compra)

@router.get("/mis-compras", response_model=list[CompraLibroResponse])
async def mis_compras(usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    return await controller.listar_por_usuario(usuario_actual.id)