from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")

class RespuestaConMensaje(BaseModel, Generic[T]):
    mensaje: str
    data: T

class Paginado(BaseModel, Generic[T]):
    items: list[T]
    total: int
    skip: int
    limit: int