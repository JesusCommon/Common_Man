from beanie import PydanticObjectId
from app.schemas.compra_producto_schema import CompraProductoResponse
from app.services.compra_producto_service import CompraProductoService

class CompraProductoController:
    def __init__(self):
        self.service = CompraProductoService()

    async def comprar(
        self,
        usuario_id: PydanticObjectId,
        producto_id: PydanticObjectId,
        cantidad: int,
    ) -> CompraProductoResponse:
        compra = await self.service.comprar(usuario_id, producto_id, cantidad)
        return CompraProductoResponse.model_validate(compra)

    async def listar_por_usuario(self, usuario_id: PydanticObjectId) -> list[CompraProductoResponse]:
        compras = await self.service.listar_por_usuario(usuario_id)
        return [CompraProductoResponse.model_validate(c) for c in compras]