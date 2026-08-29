from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from beanie import PydanticObjectId
from src.modules.pagos.document import TipoMovimientoEnum, EstadoMovimientoEnum

class WalletResponse(BaseModel):
    saldo_plataforma: Decimal
    total_transacciones: int
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)

class HistorialItemResponse(BaseModel):
    id: PydanticObjectId
    usuario_id: PydanticObjectId
    compra_id: PydanticObjectId | None
    tipo: TipoMovimientoEnum
    estado: EstadoMovimientoEnum
    monto: Decimal
    saldo_anterior: Decimal
    saldo_posterior: Decimal
    descripcion: str | None
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)