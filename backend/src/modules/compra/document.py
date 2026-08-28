from enum import Enum
from decimal import Decimal
from bson import Decimal128
from beanie import Document, PydanticObjectId, Indexed
from pydantic import BaseModel, Field, model_validator
from pymongo import IndexModel, ASCENDING, DESCENDING
from src.shared.mixins import TimestampMixim

class EstadoCompraEnum(str, Enum):
    PENDIENTE = "pendiente"
    PAGADO = "pagado"
    ENVIADO = "enviado"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

class ItemCompra(BaseModel):
    producto_id: PydanticObjectId = Field(
        ..., 
        description="ID del producto comprado"
    )
    nombre_producto_snapshot: str = Field(
        ..., 
        min_length=1, 
        max_length=200, 
        description="Nombre del producto al momento de la compra"
    )
    cantidad: int = Field(
        ..., 
        gt=0, 
        description="Cantidad de unidades adquiridas"
    )
    precio_unitario: Decimal = Field(
        ..., 
        gt=0, 
        description="Precio unitario aplicado en esta compra específica"
    )
    subtotal: Decimal = Field(
        ..., 
        ge=0, 
        description="Resultado de cantidad * precio_unitario"
    )

    @model_validator(mode="after")
    def validar_subtotal(self) -> "ItemCompra":
        subtotal_calculado = self.cantidad * self.precio_unitario
        if self.subtotal != subtotal_calculado.quantize(Decimal("0.01")):
            raise ValueError(
                f"El subtotal ({self.subtotal}) no coincide con cantidad * precio_unitario ({subtotal_calculado})"
            )
        return self

class Compras(Document, TimestampMixim):
    usuario_id: PydanticObjectId = Field(
        ..., 
        description="ID del usuario que realizó la compra"
    )
    
    numero_orden: str = Indexed(
        unique=True,
        description="Folio único de la orden (ej: ORD-20231024-001)"
    )

    items: list[ItemCompra] = Field(
        default_factory=list,
        description="Lista de productos adquiridos en esta orden"
    )

    subtotal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Suma de los subtotales de los items"
    )
    
    descuento: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Descuento total aplicado a la orden"
    )
    
    impuestos: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        description="Impuestos calculados sobre la compra"
    )
    
    total: Decimal = Field(
        ...,
        gt=0,
        description="Monto final a pagar (subtotal - descuento + impuestos)"
    )

    estado: EstadoCompraEnum = Field(
        default=EstadoCompraEnum.PENDIENTE,
        description="Estado actual del ciclo de vida de la compra"
    )
    
    notas: str | None = Field(
        default=None,
        max_length=500,
        description="Notas adicionales o instrucciones de envío"
    )

    @model_validator(mode="before")
    @classmethod
    def convertir_decimals(cls, data: dict) -> dict:
        if isinstance(data, dict):
            for field in ["subtotal", "descuento", "impuestos", "total"]:
                if field in data and isinstance(data[field], Decimal128):
                    data[field] = data[field].to_decimal()
            
            # También aplicar a los items embebidos si existen
            if "items" in data and isinstance(data["items"], list):
                for item in data["items"]:
                    if isinstance(item, dict):
                        if "precio_unitario" in item and isinstance(item["precio_unitario"], Decimal128):
                            item["precio_unitario"] = item["precio_unitario"].to_decimal()
                        if "subtotal" in item and isinstance(item["subtotal"], Decimal128):
                            item["subtotal"] = item["subtotal"].to_decimal()
        return data

    class Settings:
        name = "compras"
        indexes = [
            # Historial de compras de un usuario, ordenado de más reciente a más antiguo
            IndexModel([("usuario_id", ASCENDING), ("fecha_creacion", DESCENDING)]),
            # Búsqueda rápida por folio de orden
            IndexModel([("numero_orden", ASCENDING)], unique=True),
            # Panel de administración: filtrar por estado y ordenar por fecha
            IndexModel([("estado", ASCENDING), ("fecha_creacion", DESCENDING)]),
        ]