from fastapi import HTTPException, status
from app.repos.follow_repo import SeguimientoRepo
from app.models.usuarios_model import Usuario
from beanie import PydanticObjectId
from beanie.odm.operators.update.general import Inc


class SeguimientoService:
    def __init__(self):
        self.repo = SeguimientoRepo()

    async def seguir(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> None:
        if seguidor_id == seguido_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes seguirte a ti mismo"
            )

        seguido = await Usuario.get(seguido_id)
        if not seguido:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario a seguir no encontrado")

        if await self.repo.existe(seguidor_id, seguido_id):
            raise HTTPException(status.HTTP_409_CONFLICT, "Ya sigues a este usuario")

        await self.repo.crear(seguidor_id, seguido_id)

        # actualizar contadores atómicamente
        await Usuario.find_one(Usuario.id == seguidor_id).update(Inc({Usuario.seguidos_count: 1}))
        await Usuario.find_one(Usuario.id == seguido_id).update(Inc({Usuario.seguidores_count: 1}))

    async def dejar_de_seguir(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> None:
        eliminado = await self.repo.eliminar(seguidor_id, seguido_id)
        if not eliminado:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No sigues a este usuario")

        await Usuario.find_one(Usuario.id == seguidor_id).update(Inc({Usuario.seguidos_count: -1}))
        await Usuario.find_one(Usuario.id == seguido_id).update(Inc({Usuario.seguidores_count: -1}))

    async def listar_seguidores(self, usuario_id: PydanticObjectId) -> list[Usuario]:
        docs = await self.repo.listar_seguidores(usuario_id)
        return [d.seguidor for d in docs]

    async def listar_seguidos(self, usuario_id: PydanticObjectId) -> list[Usuario]:
        docs = await self.repo.listar_seguidos(usuario_id)
        return [d.seguido for d in docs]

    async def esta_siguiendo(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> bool:
        return await self.repo.existe(seguidor_id, seguido_id)