from beanie import PydanticObjectId
from src.modules.follow.document import Follow
from src.modules.follow.schema import FollowCreate
from src.modules.follow.service import FollowService
from src.modules.usuarios.document import Usuario

class FollowController:
    def __init__(self):
        self.service = FollowService()

    async def seguir(self, seguidor: Usuario, data: FollowCreate) -> Follow:
        return await self.service.seguir(seguidor, data)

    async def dejar_de_seguir(self, seguidor: Usuario, username: str) -> Follow:
        return await self.service.dejar_de_seguir(seguidor, username)

    async def listar_seguidores(
        self, id_usuario: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> tuple[list[Follow], int]:
        return await self.service.listar_seguidores(id_usuario, skip=skip, limit=limit)

    async def listar_seguidos(
        self, id_usuario: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> tuple[list[Follow], int]:
        return await self.service.listar_seguidos(id_usuario, skip=skip, limit=limit)

    async def obtener_relacion(
        self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId
    ) -> Follow | None:
        return await self.service.obtener_relacion(seguidor_id, seguido_id)