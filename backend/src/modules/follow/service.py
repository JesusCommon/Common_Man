from fastapi import HTTPException, status
from src.modules.follow.document import Follow
from src.modules.follow.schema import FollowCreate
from src.modules.follow.repo import FollowRepo
from src.modules.usuarios.document import Usuario
from src.modules.usuarios.repo import UsuarioRepo
from beanie import PydanticObjectId

class FollowService:
    def __init__(self):
        self.repo = FollowRepo()
        self.usuarios_repo = UsuarioRepo()

    def _validar_activo(self, usuario: Usuario) -> None:
        if not usuario.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida sobre un usuario inactivo"
            )

    async def _resolver_seguido(self, username: str) -> Usuario:
        seguido = await self.usuarios_repo.obtener_por_username(username)
        if not seguido:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe un usuario con el username '{username}'"
            )
        return seguido

    async def seguir(self, seguidor: Usuario, data: FollowCreate) -> Follow:
        seguido = await self._resolver_seguido(data.username)

        if seguidor.id == seguido.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes seguirte a ti mismo"
            )

        self._validar_activo(seguido)

        existente = await self.repo.obtener_relacion(seguidor.id, seguido.id)
        if existente:
            if existente.activo:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya sigues a '{seguido.username}'"
                )
            existente.activo = True
            await existente.save()
            return existente

        return await self.repo.crear_relacion(seguidor, seguido)

    async def dejar_de_seguir(self, seguidor: Usuario, username: str) -> Follow:
        seguido = await self._resolver_seguido(username)

        relacion = await self.repo.obtener_relacion(seguidor.id, seguido.id)
        if not relacion or not relacion.activo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No sigues a '{seguido.username}'"
            )

        return await self.repo.eliminar_relacion(seguidor.id, seguido.id)

    async def listar_seguidores(
        self, id_usuario: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> tuple[list[Follow], int]:
        return await self.repo.listar_seguidores(id_usuario, skip=skip, limit=limit)

    async def listar_seguidos(
        self, id_usuario: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> tuple[list[Follow], int]:
        return await self.repo.listar_seguidos(id_usuario, skip=skip, limit=limit)

    async def obtener_relacion(
        self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId
    ) -> Follow | None:
        return await self.repo.obtener_relacion(seguidor_id, seguido_id)