from fastapi import APIRouter, Depends, Query
from beanie import PydanticObjectId
from src.core.security.jwt import obtener_usuario_actual
from src.modules.pagos.controller import PagoController
from src.modules.pagos.schema import MovimientoSaldoResponse
from src.modules.compra.schema import CompraResponse
from src.shared.common_schema import RespuestaConMensaje, Paginado

router = APIRouter(prefix="/pagos", tags=["Pagos"])
controller = PagoController()

@router.post(
    "/compra/{compra_id}",
    response_model=RespuestaConMensaje[MovimientoSaldoResponse],
    status_code=201,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def procesar_pago(
    compra_id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):

    movimiento = await controller.procesar_pago(
        compra_id=compra_id,
        usuario_id=usuario.id
    )
    return RespuestaConMensaje(
        mensaje="Pago procesado correctamente",
        data=movimiento
    )


@router.post(
    "/compra/{compra_id}/cancelar",
    response_model=RespuestaConMensaje[CompraResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def cancelar_compra(
    compra_id: PydanticObjectId,
    usuario=Depends(obtener_usuario_actual),
):
    compra = await controller.cancelar_compra(
        compra_id=compra_id,
        usuario_id=usuario.id
    )
    return RespuestaConMensaje(
        mensaje="Compra cancelada correctamente",
        data=compra
    )


@router.get(
    "/compra/{compra_id}/movimiento",
    response_model=MovimientoSaldoResponse,
    dependencies=[Depends(obtener_usuario_actual)],
)
async def obtener_movimiento_de_compra(compra_id: PydanticObjectId):
    return await controller.obtener_movimiento_por_compra(compra_id)


@router.get(
    "/historial",
    response_model=Paginado[MovimientoSaldoResponse],
    dependencies=[Depends(obtener_usuario_actual)],
)
async def listar_historial(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    usuario=Depends(obtener_usuario_actual),
):
    movimientos, total = await controller.listar_historial_usuario(
        usuario_id=usuario.id,
        skip=skip,
        limit=limit
    )
    return Paginado(items=movimientos, total=total, skip=skip, limit=limit)