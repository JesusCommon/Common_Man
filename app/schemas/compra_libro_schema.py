from pydantic import BaseModel, ConfigDict, field_validator, Field
from datetime import datetime
from beanie import PydanticObjectId, Link

class CompraLibroCreate(BaseModel):
    libro_id: PydanticObjectId = Field(
        ...,
        description="ID del libro a comprar"
    )

class CompraLibroResponse(BaseModel):
    id: PydanticObjectId
    usuario: PydanticObjectId
    libro: PydanticObjectId
    precio_pagado: float
    fecha_creacion: datetime

    @field_validator("usuario", "libro", mode="before")
    @classmethod
    def extraer_id(cls, v):
        if isinstance(v, Link):
            return v.ref.id
        return v

    model_config = ConfigDict(from_attributes=True)