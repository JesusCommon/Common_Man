from fastapi import HTTPException, status
from app.models.libros_model import Libro
from app.schemas.libros_schema import LibroCreate, LibroUpdate
from app.models.categoria_libro_model import Categoria
from app.repos.libros_repo import LibroRepo
from beanie import PydanticObjectId


class LibroService:
    def __init__(self):
        self.repo = LibroRepo()

    def _validar_activo(self, libro: Libro) -> None:
        if not libro.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un libro inactivo"
            )


    async def crear(self, data: LibroCreate) -> Libro:
        if await self.repo.obtener_por_nombre(data.nombre):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un libro registrado con el nombre '{data.nombre}'"
            )

        categoria = await Categoria.get(data.categoria)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe una categoría con el ID '{data.categoria}'"
            )

        datos = data.model_dump(exclude_unset=True)
        datos["categoria"] = data.categoria  # ✅ usa el ID original, no el objeto `categoria`
        documento = Libro(**datos)
        await documento.insert()
        return documento
    
    async def listar(self) -> list[Libro]:
        return await self.repo.listar()

    async def listar_activos(self) -> list[Libro]:
        return await self.repo.listar_activos()

    async def obtener_por_id(self, id: PydanticObjectId) -> Libro:
        libro = await self.repo.obtener_por_id(id)
        if not libro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Libro con ID {id} No encontrado"
            )
        return libro

    async def actualizar(self, id: PydanticObjectId, data: LibroUpdate) -> Libro:
        libro = await self.obtener_por_id(id)
        self._validar_activo(libro)

        if data.nombre:
            existente = await self.repo.obtener_por_nombre(data.nombre)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un libro con el nombre '{data.nombre}'"
                )

        return await self.repo.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> Libro:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Libro:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)