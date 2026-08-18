from typing import Generic, TypeVar, Type
from beanie import Document, PydanticObjectId
from pydantic import BaseModel

T = TypeVar("T", bound=Document)
C = TypeVar("C", bound=BaseModel)
U = TypeVar("U", bound=BaseModel)

class BaseRepo(Generic[T, C, U]):
    def __init__(self, model: Type[T]):
        self.model = model

    async def crear(self, data: C) -> T:
        documento = self.model(**data.model_dump())
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[T], int]:
        query = self.model.find_all()
        total = await query.count()
        documento = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return documento, total

    async def obtener_por_id(self, id: PydanticObjectId) -> T | None:
        return await self.model.get(id)

    async def actualizar(self, id: PydanticObjectId, data: U) -> T | None:
        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        campos = data.model_dump(exclude_unset=True)
        for campo, valor in campos.items():
            setattr(documento, campo, valor)

        await documento.save()
        return documento

class BaseRepoConEstado(BaseRepo[T, C, U]):
    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[T], int]:
        query = self.model.find(self.model.activo == True)
        total = await query.count()
        documento = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return documento, total

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[T], int]:
        query = self.model.find(self.model.activo == False)
        total = await query.count()
        documento = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return documento, total

    async def activar(self, id: PydanticObjectId) -> T | None:
        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        documento.activo = True
        await documento.save()
        return documento

    async def desactivar(self, id: PydanticObjectId) -> T | None:
        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        documento.activo = False
        await documento.save()
        return documento