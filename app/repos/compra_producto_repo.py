from app.models.compra_producto_model import CompraProducto
from beanie import PydanticObjectId

class CompraProductoRepo:
    async def crear(
        self,
        usuario_id: PydanticObjectId,
        producto_id: PydanticObjectId,
        cantidad: int,
        precio_unitario: float,
        precio_total: float,
    ) -> CompraProducto:
        documento = CompraProducto(
            usuario=usuario_id,
            producto=producto_id,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
            precio_total=precio_total,
        )
        await documento.insert()
        return documento

    async def listar_por_usuario(self, usuario_id: PydanticObjectId) -> list[CompraProducto]:
        return await CompraProducto.find(
            CompraProducto.usuario.id == usuario_id
        ).to_list()

    async def obtener_por_id(self, id: PydanticObjectId) -> CompraProducto | None:
        return await CompraProducto.get(id)