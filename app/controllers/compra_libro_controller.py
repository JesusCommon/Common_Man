from beanie import PydanticObjectId
from app.schemas.compra_libro_schema import CompraLibroResponse
from app.services.compra_libro_service import CompraLibroService

class CompraLibroController:
    def __init__(self):
        self.service = CompraLibroService()

    async def comprar(self, usuario_id: PydanticObjectId, libro_id: PydanticObjectId) -> CompraLibroResponse:
        compra = await self.service.comprar(usuario_id, libro_id)
        return CompraLibroResponse.model_validate(compra)

    async def listar_por_usuario(self, usuario_id: PydanticObjectId) -> list[CompraLibroResponse]:
        compras = await self.service.listar_por_usuario(usuario_id)
        return [CompraLibroResponse.model_validate(c) for c in compras]