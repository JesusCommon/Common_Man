from fastapi import HTTPException, status
from src.modules.categorias_libro.document import CategoriaLibro
from src.modules.categorias_libro.schema import CategoriaLibroCreate, CategoriaLibroUpdate
from src.modules.categorias_libro.repo import CategoriaLibroRepo
from beanie import PydanticObjectId

class CategoriaLibroService:
    def __init__(self):
        self.repo = CategoriaLibroRepo()

    def _validar_activo(self, categoria: CategoriaLibro) -> None:
        if not categoria.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para categoria inactiva"
            )

    async def crear(self, data: CategoriaLibroCreate) -> CategoriaLibro:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Categorias con el nombre '{data.nombre}' registrada"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = CategoriaLibro(**datos)
        await documento.insert()
        return documento

    async def listar(self) -> list[CategoriaLibro]:
        return await self.repo.listar()
    
    async def listar_activos(self) -> list[CategoriaLibro]:
        return await self.repo.listar_activos()

    async def obtener_por_id(self, id: PydanticObjectId) -> CategoriaLibro:
        categoria = await self.repo.obtener_por_id(id)
        if not categoria:
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoroa con ID {id} no encontrada"
            )
        return categoria

    async def actualizar(self, id: PydanticObjectId, data: CategoriaLibroUpdate) -> CategoriaLibro:
        categoria = await self.repo.obtener_por_id(id)
        self._validar_activo(categoria)
        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe una categoria con el nombre '{data.nombre}'"
                )
            return await self.repo.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> CategoriaLibro:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)
    
    async def desactivar(self, id: PydanticObjectId) -> CategoriaLibro:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)