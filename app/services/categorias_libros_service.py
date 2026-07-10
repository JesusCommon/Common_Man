from fastapi import HTTPException, status
from app.models.categorias_libros_model import Categorias
from app.schemas.categorias_libros_schema import CategoriaCreate, CategoriaUpdate
from app.repos.categorias_libros_repo import CategoriaRepo
from beanie import PydanticObjectId


class categoriaService:
    def __init__(self):
        self.repo = CategoriaRepo()

    def _validar_activo(self, categoria: Categorias) -> None:
        if not categoria.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un categoria inactiva"
            )

    async def crear(self, data: CategoriaCreate) -> Categorias:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una categoria registrada con el correo '{data.nombre}'"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = Categorias(**datos)
        await documento.insert()
        return documento

    async def listar(self) -> list[Categorias]:
        return await self.repo.listar()

    async def listar_activos(self) -> list[Categorias]:
        return await self.repo.listar_activos()

    async def obtener_por_id(self, id: PydanticObjectId) -> Categorias:
        categoria = await self.repo.obtener_por_id(id)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria con ID {id} No encontrado"
            )
        return categoria

    async def actualizar(self, id: PydanticObjectId, data: CategoriaUpdate) -> Categorias:
        categoria = await self.obtener_por_id(id)
        self._validar_activo(categoria)

        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe una categoria con el correo '{data.nombre}'"
                )

        return await self.repo.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Categorias:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Categorias:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)