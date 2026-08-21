from beanie import PydanticObjectId
from uuid import UUID
from src.modules.follow.document import Follow
from src.modules.follow.schema import FollowCreate
from src.modules.usuarios.document import Usuario
from src.shared.repositories.BaseRepo import BaseRepoConEstado

MAX_LIMIT = 100


class FollowRepo(BaseRepoConEstado[Follow, FollowCreate, FollowCreate]):
    def __init__(self):
        super().__init__(Follow)

    async def obtener_por_identificador(self, identificador: UUID) -> Follow | None:
        return await self.model.find_one(
            self.model.identificador == identificador,
            fetch_links=True,
        )

    async def obtener_relacion(
        self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId
    ) -> Follow | None:
        return await self.model.find_one(
            self.model.seguidor.id == seguidor_id,
            self.model.seguido.id == seguido_id,
            fetch_links=True,
        )

    async def crear_relacion(
        self, seguidor: Usuario, seguido: Usuario
    ) -> Follow:
        existente = await self.obtener_relacion(seguidor.id, seguido.id)
        if existente:
            return existente

        documento = self.model(seguidor=seguidor, seguido=seguido)
        await documento.insert()
        return await self.obtener_relacion(seguidor.id, seguido.id)

    async def listar_seguidores(
        self, seguido_id: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> tuple[list[Follow], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(
            self.model.seguido.id == seguido_id,
            self.model.activo == True,
            fetch_links=True,
        )
        total = await query.count()
        seguidores = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return seguidores, total

    async def listar_seguidos(
        self, seguidor_id: PydanticObjectId, skip: int = 0, limit: int = 20
    ) -> tuple[list[Follow], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(
            self.model.seguidor.id == seguidor_id,
            self.model.activo == True,
            fetch_links=True,
        )
        total = await query.count()
        seguidos = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return seguidos, total

    async def eliminar_relacion(
        self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId
    ) -> Follow | None:
        documento = await self.obtener_relacion(seguidor_id, seguido_id)
        if not documento:
            return None

        documento.activo = False
        await documento.save()
        return documento