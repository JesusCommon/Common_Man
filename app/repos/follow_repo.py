from app.models.follow_model import Seguimiento
from beanie import PydanticObjectId

class SeguimientoRepo:
    async def existe(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> bool:
        doc = await Seguimiento.find_one(
            Seguimiento.seguidor.id == seguidor_id,
            Seguimiento.seguido.id == seguido_id
        )
        return doc is not None

    async def crear(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> Seguimiento:
        doc = Seguimiento(seguidor=seguidor_id, seguido=seguido_id)
        await doc.insert()
        return doc

    async def eliminar(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> bool:
        doc = await Seguimiento.find_one(
            Seguimiento.seguidor.id == seguidor_id,
            Seguimiento.seguido.id == seguido_id
        )
        if not doc:
            return False
        await doc.delete()
        return True

    async def listar_seguidores(self, usuario_id: PydanticObjectId) -> list[Seguimiento]:
        return await Seguimiento.find(
            Seguimiento.seguido.id == usuario_id, fetch_links=True
        ).to_list()

    async def listar_seguidos(self, usuario_id: PydanticObjectId) -> list[Seguimiento]:
        return await Seguimiento.find(
            Seguimiento.seguidor.id == usuario_id, fetch_links=True
        ).to_list()