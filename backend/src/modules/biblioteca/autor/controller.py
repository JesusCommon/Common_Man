from beanie import PydanticObjectId
from fastapi import UploadFile
from src.modules.biblioteca.autor.document import Autor
from src.modules.biblioteca.autor.schema import (
    AutorCreate,
    AutorUpdate
)
from src.modules.biblioteca.autor.service import AutorService

class AutorController:
    def __init__(self):
        self.service = AutorService()

    async def crear(self, data: AutorCreate) -> Autor:
        return await self.service.crear(data)

    async def actualizar(self, id: PydanticObjectId, data: AutorUpdate) -> Autor:
        return await self.service.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Autor:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Autor:
        return await self.service.desactivar(id)

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Autor], int]:
        return await self.service.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Autor], int]:
        return await self.service.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Autor], int]:
        return await self.service.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Autor]:
        return await self.service.listar_publicas()

    async def obtener_id(self, id: PydanticObjectId) -> Autor:
        return await self.service.obtener_por_id(id)

    async def actualizar_imagen(
        self, autor_id: PydanticObjectId, imagen: UploadFile
    ) -> Autor:
        return await self.service.actualizar_imagen(autor_id, imagen)

    async def eliminar_imagen(self, autor_id: PydanticObjectId) -> Autor:
        return await self.service.eliminar_imagen(autor_id)