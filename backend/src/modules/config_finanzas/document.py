from decimal import Decimal
from bson import Decimal128
from beanie import Document
from pydantic import Field, model_validator
from src.shared.mixins import TimestampMixim


class ConfiguracionSistema(Document, TimestampMixim):
    saldo_plataforma: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Saldo total recaudado por la plataforma (wallet)"
    )
    
    total_transacciones: int = Field(
        default=0,
        ge=0,
        description="Número total de transacciones procesadas"
    )

    @model_validator(mode="before")
    @classmethod
    def convertir_decimals(cls, data: dict) -> dict:
        if isinstance(data, dict):
            if "saldo_plataforma" in data and isinstance(data["saldo_plataforma"], Decimal128):
                data["saldo_plataforma"] = data["saldo_plataforma"].to_decimal()
        return data

    class Settings:
        name = "configuracion_sistema"