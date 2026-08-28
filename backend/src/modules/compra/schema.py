from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from beanie import PydanticObjectId
from src.modules.compra.document import EstadoCompraEnum

class CompraItemCreate(BaseModel):
    producto_id: PydanticObjectId
    cantidad: int = Field(..., gt=0, le=999)

class CompraCreate(BaseModel):
    items: list[CompraItemCreate] = Field(..., min_length=1, max_length=50)
    notas: str | None = Field(default=None, max_length=500)
    descuento: Decimal | None = Field(default=Decimal("0.00"), ge=0)
    impuestos: Decimal | None = Field(default=Decimal("0.00"), ge=0)

    @field_validator("descuento", "impuestos", mode="before")
    @classmethod
    def validar_decimales(cls, v):
        if v is None:
            return Decimal("0.00")
        try:
            return Decimal(str(v)).quantize(Decimal("0.01"))
        except Exception:
            raise ValueError("El valor debe ser un número decimal válido")


class CompraUpdate(BaseModel):
    notas: str | None = Field(default=None, max_length=500)


class CompraEstadoUpdate(BaseModel):
    estado: EstadoCompraEnum

class CompraItemResponse(BaseModel):
    producto_id: PydanticObjectId
    nombre_producto_snapshot: str
    cantidad: int
    precio_unitario: Decimal
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


class CompraResponse(BaseModel):
    id: PydanticObjectId
    numero_orden: str
    items: list[CompraItemResponse]
    subtotal: Decimal
    descuento: Decimal
    impuestos: Decimal
    total: Decimal
    estado: EstadoCompraEnum
    notas: str | None
    fecha_creacion: datetime
    fecha_actualizacion: datetime

    model_config = ConfigDict(from_attributes=True)


class CompraAdminResponse(CompraResponse):
    usuario_id: PydanticObjectId

    model_config = ConfigDict(from_attributes=True)