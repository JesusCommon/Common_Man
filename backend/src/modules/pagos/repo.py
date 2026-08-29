from beanie import PydanticObjectId
from src.modules.pagos.document import MovimientoSaldo, EstadoMovimientoEnum
from src.modules.pagos.schema import PagoRequest, MovimientoSaldoUpdate
from src.shared.repositories.BaseRepo import BaseRepo

MAX_LIMIT = 100

class MovimientoSaldoRepo(BaseRepo[MovimientoSaldo, PagoRequest, MovimientoSaldoUpdate]):
    def __init__(self):
        super().__init__(MovimientoSaldo)

    async def obtener_por_compra_id(self, compra_id: PydanticObjectId) -> MovimientoSaldo | None:
        return await self.model.find_one(self.model.compra_id == compra_id)

    async def existe_pago_para_compra(self, compra_id: PydanticObjectId) -> bool:
        movimiento = await self.model.find_one(
            self.model.compra_id == compra_id,
            self.model.estado == EstadoMovimientoEnum.EXITOSO
        )
        return movimiento is not None

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[MovimientoSaldo], int]:
        limit = min(limit, MAX_LIMIT)
        
        query = self.model.find(self.model.usuario_id == usuario_id)
        total = await query.count()
        
        movimientos = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        
        return movimientos, total

    async def actualizar_estado(
        self,
        id: PydanticObjectId,
        nuevo_estado: EstadoMovimientoEnum,
    ) -> MovimientoSaldo | None:
        resultado = await self.model.find_one(self.model.id == id).update(
            {"$set": {self.model.estado: nuevo_estado}}
        )
        
        if resultado.modified_count == 0:
            return None
        
        return await self.obtener_por_id(id)