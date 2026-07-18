# controllers/seguimiento_controller.py
from beanie import PydanticObjectId
from app.services.follow_service import SeguimientoService
from app.schemas.follow_schema import SeguidorResponse

class SeguimientoController:
    def __init__(self):
        self.service = SeguimientoService()

    async def seguir(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> dict:
        await self.service.seguir(seguidor_id, seguido_id)
        return {"mensaje": "Ahora sigues a este usuario"}

    async def dejar_de_seguir(self, seguidor_id: PydanticObjectId, seguido_id: PydanticObjectId) -> dict:
        await self.service.dejar_de_seguir(seguidor_id, seguido_id)
        return {"mensaje": "Dejaste de seguir a este usuario"}

    async def listar_seguidores(self, usuario_id: PydanticObjectId) -> list[SeguidorResponse]:
        usuarios = await self.service.listar_seguidores(usuario_id)
        return [SeguidorResponse.model_validate(u) for u in usuarios]

    async def listar_seguidos(self, usuario_id: PydanticObjectId) -> list[SeguidorResponse]:
        usuarios = await self.service.listar_seguidos(usuario_id)
        return [SeguidorResponse.model_validate(u) for u in usuarios]