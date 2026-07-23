from fastapi import HTTPException, status
from app.models.categoria_producto_model import CategoriaProducto
from app.schemas.categoria_producto_schema import CategoriaCreate, CategoriaUpdate
from app.repos.categoria_producto_repo import CategoriaRepo
from beanie import PydanticObjectId


class categoriaService:
    def __init__(self):
        self.repo = CategoriaRepo()

    def _validar_activo(self, categoria: CategoriaProducto) -> None:
        if not categoria.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un categoria inactiva"
            )

    async def crear(self, data: CategoriaCreate) -> CategoriaProducto:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una categoria registrada con el nombre '{data.nombre}'"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = CategoriaProducto(**datos)
        await documento.insert()
        return documento

    async def listar(self) -> list[CategoriaProducto]:
        return await self.repo.listar()

    async def listar_activos(self) -> list[CategoriaProducto]:
        return await self.repo.listar_activos()

    async def obtener_por_id(self, id: PydanticObjectId) -> CategoriaProducto:
        categoria = await self.repo.obtener_por_id(id)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria con ID {id} No encontrado"
            )
        return categoria

    async def actualizar(self, id: PydanticObjectId, data: CategoriaUpdate) -> CategoriaProducto:
        categoria = await self.obtener_por_id(id)
        self._validar_activo(categoria)

        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe una categoria con el nombre '{data.nombre}'"
                )

        return await self.repo.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> CategoriaProducto:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> CategoriaProducto:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)