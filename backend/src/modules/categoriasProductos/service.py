from fastapi import HTTPException, status
from src.modules.categoriasProductos.document import Categorias
from src.modules.categoriasProductos.schema import (
    CategoriaCreate,
    CategoriaUpdate
)
from src.modules.categoriasProductos.repo import CategoriaRepo
from beanie import PydanticObjectId


class CategoriaService:
    def __init__(self):
        self.repo = CategoriaRepo()

    def _validar_activo(self, categoria: Categorias) -> None:
        if not categoria.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para una categoria inactiva"
            )

    async def crear(self, data: CategoriaCreate) -> Categorias:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una categoria registrada con el nombre '{data.nombre}'"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = Categorias(**datos)
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Categorias], int]:
        return await self.repo.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Categorias], int]:
        return await self.repo.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Categorias], int]:
        return await self.repo.listar_inactivos(skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Categorias]:
        categorias, _ = await self.repo.listar_activos(skip=0, limit=200)
        return sorted(categorias, key=lambda c: c.nombre)

    async def obtener_por_id(self, id: PydanticObjectId) -> Categorias:
        categoria = await self.repo.obtener_por_id(id)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria no encontrado"
            )
        return categoria

    async def _validar_conflictos(
        self, data: CategoriaUpdate, identificador_actual: PydanticObjectId
    ) -> None:
        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe una categoria con el nombre '{data.nombre}'"
                )

    async def actualizar(self, id: PydanticObjectId, data: CategoriaUpdate) -> Categorias:
        categoria = await self.obtener_por_id(id)
        self._validar_activo(categoria)
        await self._validar_conflictos(data, id)
        return await self.repo.actualizar(categoria.id, data)

    async def activar(self, id: PydanticObjectId) -> Categorias:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Categorias:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)