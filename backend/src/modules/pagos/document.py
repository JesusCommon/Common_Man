from enum import Enum
from decimal import Decimal
from bson import Decimal128
from beanie import Document, PydanticObjectId
from pydantic import Field, model_validator
from pymongo import IndexModel, ASCENDING, DESCENDING
from src.shared.mixins import TimestampMixim

class TipoMovimientoEnum(str, Enum):
    PAGO_COMPRA = "pago_compra"
    REEMBOLSO = "reembolso"
    RECARGA = "recarga"

class EstadoMovimientoEnum(str, Enum):
    EXITOSO = "exitoso"
    FALLIDO = "fallido"
    REVERTIDO = "revertido"

class MovimientoSaldo(Document, TimestampMixim):
    usuario_id: PydanticObjectId = Field(
        ...,
        description="ID del usuario cuyo saldo fue afectado"
    )
    
    compra_id: PydanticObjectId | None = Field(
        default=None,
        description="ID de la compra asociada (null si es recarga)"
    )
    
    tipo: TipoMovimientoEnum = Field(
        ...,
        description="Tipo de movimiento: pago, reembolso o recarga"
    )
    
    estado: EstadoMovimientoEnum = Field(
        default=EstadoMovimientoEnum.EXITOSO,
        description="Estado del movimiento"
    )
    
    monto: Decimal = Field(
        ...,
        description="Monto del movimiento (negativo para pagos, positivo para reembolsos/recargas)"
    )
    
    saldo_anterior: Decimal = Field(
        ...,
        ge=0,
        description="Saldo del usuario ANTES del movimiento"
    )
    
    saldo_posterior: Decimal = Field(
        ...,
        ge=0,
        description="Saldo del usuario DESPUÉS del movimiento"
    )
    
    descripcion: str | None = Field(
        default=None,
        max_length=255,
        description="Descripción opcional del movimiento"
    )

    @model_validator(mode="before")
    @classmethod
    def convertir_decimals(cls, data: dict) -> dict:
        if isinstance(data, dict):
            for field in ["monto", "saldo_anterior", "saldo_posterior"]:
                if field in data and isinstance(data[field], Decimal128):
                    data[field] = data[field].to_decimal()
        return data

    class Settings:
        name = "movimientos_saldo"
        indexes = [
            IndexModel([("usuario_id", ASCENDING), ("fecha_creacion", DESCENDING)]),
            IndexModel([("compra_id", ASCENDING)], unique=True, sparse=True),
            IndexModel([("tipo", ASCENDING), ("fecha_creacion", DESCENDING)]),
        ]