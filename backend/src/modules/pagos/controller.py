from beanie import PydanticObjectId
from src.modules.pagos.document import MovimientoSaldo
from src.modules.compra.document import Compras
from src.modules.pagos.service import PagoService

class PagoController:
    def __init__(self):
        self.service = PagoService()

    async def procesar_pago(
        self, compra_id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> MovimientoSaldo:
        return await self.service.procesar_pago(compra_id, usuario_id)

    async def cancelar_compra(
        self, compra_id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Compras:
        return await self.service.cancelar_compra(compra_id, usuario_id)

    async def obtener_movimiento_por_compra(
        self, compra_id: PydanticObjectId
    ) -> MovimientoSaldo:
        return await self.service.obtener_movimiento_por_compra(compra_id)

    async def listar_historial_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[MovimientoSaldo], int]:
        return await self.service.listar_historial_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit
        )