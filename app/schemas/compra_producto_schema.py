# schemas/compra_producto_schema.py
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from beanie import PydanticObjectId, Link

class CompraProductoCreate(BaseModel):
    producto_id: PydanticObjectId = Field(
        ...,
        description="ID del producto a comprar"
    )
    cantidad: int = Field(
        ...,
        ge=1,
        description="Cantidad de unidades a comprar",
        examples=[2]
    )

class CompraProductoResponse(BaseModel):
    id: PydanticObjectId
    usuario: PydanticObjectId
    producto: PydanticObjectId
    cantidad: int
    precio_unitario: float
    precio_total: float
    fecha_creacion: datetime

    @field_validator("usuario", "producto", mode="before")
    @classmethod
    def extraer_id(cls, v):
        if isinstance(v, Link):
            return v.ref.id
        return v

    model_config = ConfigDict(from_attributes=True)