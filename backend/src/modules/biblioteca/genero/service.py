from fastapi import HTTPException, status
from src.modules.biblioteca.genero.document import Genero
from src.modules.biblioteca.genero.schema import (
    GeneroCreate,
    GeneroUpdate
)
from src.modules.biblioteca.genero.repo import GeneroRepo
from beanie import PydanticObjectId

class GeneroService:
    def __init__(self):
        self.repo = GeneroRepo()

    def _validar_activo(self, genero: Genero) -> None:
        if not genero.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un genero inactivo"
            )

    async def crear(self, data: GeneroCreate) -> Genero:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un genero registrado con el nombre '{data.nombre}'"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = Genero(**datos)
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Genero], int]:
        return await self.repo.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Genero], int]:
        return await self.repo.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Genero], int]:
        return await self.repo.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Genero]:
        generos, _ = await self.repo.listar_activos(skip=0, limit=200)
        return sorted(generos, key=lambda c: c.nombre)

    async def obtener_por_id(self, id: PydanticObjectId) -> Genero:
        genero = await self.repo.obtener_por_id(id)
        if not genero:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Genero no encontrado"
            )
        return genero

    async def _validar_conflictos(
        self, data: GeneroUpdate, identificador_actual: PydanticObjectId
    ) -> None:
        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un genero con el nombre '{data.nombre}'"
                )

    async def actualizar(self, id: PydanticObjectId, data: GeneroUpdate) -> Genero:
        genero = await self.obtener_por_id(id)
        self._validar_activo(genero)
        await self._validar_conflictos(data, id)
        return await self.repo.actualizar(genero.id, data)

    async def activar(self, id: PydanticObjectId) -> Genero:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Genero:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)