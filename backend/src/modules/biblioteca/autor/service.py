from fastapi import HTTPException, UploadFile, status
from src.core.storage.cloudinary_client import cloudinary_storage

from src.modules.biblioteca.autor.document import Autor
from src.modules.biblioteca.autor.schema import (
    AutorCreate,
    AutorUpdate
)
from src.modules.biblioteca.autor.repo import AutorRepo
from beanie import PydanticObjectId

class AutorService:
    def __init__(self):
        self.repo = AutorRepo()

    def _validar_activo(self, autor: Autor) -> None:
        if not autor.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un autor/a inactivo/a"
            )

    async def crear(self, data: AutorCreate) -> Autor:
        if await self.repo.obtener_por_nombre_apellido(
            data.nombre,
            data.apellido
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un autor registrado con el nombre '{data.nombre} {data.apellido}'"
            )

        datos = data.model_dump(exclude_unset=True)
        documento = Autor(**datos)
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20 ) -> tuple[list[Autor], int]:
        return await self.repo.listar(skip=skip,limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20 ) -> tuple[list[Autor], int]:
        return await self.repo.listar_activos( skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20 ) -> tuple[list[Autor], int]:
        return await self.repo.listar_inactivos( skip=skip, limit=limit)

    async def listar_publicas(self) -> list[Autor]:
        autores, _ = await self.repo.listar_activos(skip=0, limit=200 )
        return sorted(autores, key=lambda autor: autor.nombre)

    async def obtener_por_id(self, id: PydanticObjectId) -> Autor:
        autor = await self.repo.obtener_por_id(id)

        if not autor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Autor no encontrado"
            )
        return autor

    async def _validar_conflictos(
        self,
        data: AutorUpdate,
        identificador_actual: PydanticObjectId
    ) -> None:
        if data.nombre is not None or data.apellido is not None:
            autor_actual = await self.obtener_por_id( identificador_actual)

            nombre = (
                data.nombre
                if data.nombre is not None
                else autor_actual.nombre
            )

            apellido = (
                data.apellido
                if data.apellido is not None
                else autor_actual.apellido
            )

            existente = await self.repo.obtener_por_nombre_apellido(
                nombre,
                apellido
            )

            if existente and existente.id != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un autor registrado con el nombre '{nombre} {apellido}'"
                )

    async def actualizar( self, id: PydanticObjectId, data: AutorUpdate) -> Autor:
        autor = await self.obtener_por_id(id)
        self._validar_activo(autor)
        await self._validar_conflictos(data, id)
        return await self.repo.actualizar(autor.id,data)

    async def activar(self,id: PydanticObjectId) -> Autor:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Autor:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)

    async def actualizar_imagen(
        self, autor_id: PydanticObjectId, imagen: UploadFile
    ) -> Autor:
        autor = await self.obtener_por_id(autor_id)

        if not imagen.content_type or not imagen.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo debe ser una imagen",
            )

        contenido = await imagen.read()

        MAX_SIZE = 5 * 1024 * 1024
        if len(contenido) > MAX_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La imagen no puede superar los 5 MB",
            )

        if autor.imagen_public_id:
            await cloudinary_storage.eliminar_imagen(autor.imagen_public_id)

        resultado = await cloudinary_storage.subir_imagen(
            contenido=contenido,
            carpeta="autores",
            public_id=str(autor.id),
            transformaciones={
                "width": 600,
                "height": 600,
                "crop": "fill",
                "gravity": "face",
            },
        )

        autor.imagen = resultado["url"]
        autor.imagen_public_id = resultado["public_id"]
        await autor.save()

        return autor

    async def eliminar_imagen(self, autor_id: PydanticObjectId) -> Autor:
        autor = await self.obtener_por_id(autor_id)

        if autor.imagen_public_id:
            await cloudinary_storage.eliminar_imagen(autor.imagen_public_id)

        autor.imagen = None
        autor.imagen_public_id = None
        await autor.save()

        return autor