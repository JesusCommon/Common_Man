from fastapi import HTTPException, status
from app.repos.compra_producto_repo import CompraProductoRepo
from app.models.productos_model import Producto
from app.models.usuarios_model import Usuario
from app.models.compra_producto_model import CompraProducto
from beanie import PydanticObjectId
from beanie.odm.operators.update.general import Inc

class CompraProductoService:
    def __init__(self):
        self.repo = CompraProductoRepo()

    async def comprar(
        self,
        usuario_id: PydanticObjectId,
        producto_id: PydanticObjectId,
        cantidad: int,
    ) -> CompraProducto:
        producto = await Producto.get(producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe un producto con el ID '{producto_id}'"
            )

        if not producto.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Este producto no está disponible"
            )

        if not producto.disponible:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Este producto no está disponible para la compra en este momento"
            )

        if producto.stock < cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stock insuficiente. Disponible: {producto.stock}, solicitado: {cantidad}"
            )

        precio_unitario = producto.precio * (1 - producto.descuento / 100)
        precio_total = round(precio_unitario * cantidad, 2)

        usuario = await Usuario.get(usuario_id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        if usuario.saldo < precio_total:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Saldo insuficiente. Necesitas {precio_total} y tienes {usuario.saldo}"
            )

        compra = await self.repo.crear(
            usuario_id=usuario_id,
            producto_id=producto_id,
            cantidad=cantidad,
            precio_unitario=round(precio_unitario, 2),
            precio_total=precio_total,
        )

        await Usuario.find_one(Usuario.id == usuario_id).update(Inc({Usuario.saldo: -precio_total}))
        await Producto.find_one(Producto.id == producto_id).update(Inc({Producto.stock: -cantidad}))
        await Producto.find_one(Producto.id == producto_id).update(Inc({Producto.compras: cantidad}))

        return compra

    async def listar_por_usuario(self, usuario_id: PydanticObjectId) -> list[CompraProducto]:
        return await self.repo.listar_por_usuario(usuario_id)