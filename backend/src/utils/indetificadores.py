from bson.errors import InvalidId
from fastapi import HTTPException
from uuid import UUID
from beanie import PydanticObjectId

def resolver_identificador(identificador: str) -> PydanticObjectId | UUID:
    try:
        return PydanticObjectId(identificador)
    except InvalidId:
        try:
            return UUID(identificador)
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="El identificador debe ser un ObjectId o UUID válido",
            )