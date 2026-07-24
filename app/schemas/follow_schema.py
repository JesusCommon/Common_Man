from pydantic import BaseModel, Field, ConfigDict, HttpUrl
from beanie import PydanticObjectId

class SeguirRequest(BaseModel):
    seguido_id: PydanticObjectId = Field(..., description="ID del usuario a seguir")

class SeguidorResponse(BaseModel):
    id: PydanticObjectId
    nombre: str
    apellido: str | None
    username: str
    avatar: HttpUrl | None

    model_config = ConfigDict(from_attributes=True)