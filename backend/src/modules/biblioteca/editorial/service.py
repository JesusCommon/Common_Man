from fastapi import HTTPException, status
from src.modules.biblioteca.editorial.document import Editorial
from src.modules.biblioteca.editorial.schema import (
    EditorialCreate,
    EditorialUpdate
)
from src.modules.biblioteca.editorial.repo import EditorialRepo
from beanie import PydanticObjectId

class EditorialService:
    def __init__(self):
        self.repo = EditorialRepo()

    def _validar_activo(self, editorial: Editorial) -> None:
        if not editorial.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para una Editorial inactiva"
            )

    async def crear(self, data: EditorialCreate) -> Editorial:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una editorial registrada con el nombre '{data.nombre}'"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = Editorial(**datos)
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Editorial], int]:
        return await self.repo.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Editorial], int]:
        return await self.repo.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Editorial], int]:
        return await self.repo.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Editorial]:
        editoriales, _ = await self.repo.listar_activos(skip=0, limit=200)
        return sorted(editoriales, key=lambda c: c.nombre)

    async def obtener_por_id(self, id: PydanticObjectId) -> Editorial:
        editorial = await self.repo.obtener_por_id(id)
        if not editorial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Editorial no encontrado"
            )
        return editorial

    async def _validar_conflictos(
        self, data: EditorialUpdate, identificador_actual: PydanticObjectId
    ) -> None:
        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe una editorial con el nombre '{data.nombre}'"
                )

    async def actualizar(self, id: PydanticObjectId, data: EditorialUpdate) -> Editorial:
        editorial = await self.obtener_por_id(id)
        self._validar_activo(editorial)
        await self._validar_conflictos(data, id)
        return await self.repo.actualizar(editorial.id, data)

    async def activar(self, id: PydanticObjectId) -> Editorial:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Editorial:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)