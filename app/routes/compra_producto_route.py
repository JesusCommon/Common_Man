from fastapi import APIRouter, Depends
from app.schemas.compra_producto_schema import CompraProductoCreate, CompraProductoResponse
from app.schemas.common_schema import RespuestaConMensaje
from app.controllers.compras_producto_controller import CompraProductoController
from app.models.usuarios_model import Usuario
from app.core.security import obtener_usuario_actual

router = APIRouter(prefix="/compras-productos", tags=["Compras Productos"])
controller = CompraProductoController()

@router.post("/", response_model=RespuestaConMensaje[CompraProductoResponse], status_code=201)
async def comprar(
    data: CompraProductoCreate,
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    compra = await controller.comprar(usuario_actual.id, data.producto_id, data.cantidad)
    return RespuestaConMensaje(mensaje="Compra realizada satisfactoriamente", data=compra)

@router.get("/mis-compras", response_model=list[CompraProductoResponse])
async def mis_compras(usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    return await controller.listar_por_usuario(usuario_actual.id)