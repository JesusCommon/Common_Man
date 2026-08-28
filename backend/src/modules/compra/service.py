from decimal import Decimal
import time
import random
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.compra.document import Compras, ItemCompra, EstadoCompraEnum
from src.modules.compra.schema import CompraCreate
from src.modules.compra.repo import CompraRepo
from src.modules.productos.repo import ProductoRepo

class CompraService:
    def __init__(self):
        self.repo = CompraRepo()
        self.producto_repo = ProductoRepo()

    async def _generar_numero_orden(self) -> str:
        fecha = time.strftime("%Y%m%d")
        
        for _ in range(5):
            sufijo = random.randint(1000, 9999)
            numero_orden = f"ORD-{fecha}-{sufijo}"
            
            if not await self.repo.numero_orden_existe(numero_orden):
                return numero_orden
        
        timestamp = int(time.time())
        return f"ORD-{fecha}-{timestamp}"

    async def _validar_productos_y_calcular_items(
        self, items_data: list[dict]
    ) -> tuple[list[ItemCompra], Decimal]:
        items_validados = []
        subtotal_general = Decimal("0.00")

        for item_data in items_data:
            producto_id = item_data["producto_id"]
            cantidad = item_data["cantidad"]

            producto = await self.producto_repo.obtener_por_id(producto_id)
            
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Producto con ID '{producto_id}' no encontrado"
                )
            
            if not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"El producto '{producto.nombre}' no está disponible"
                )
            
            if producto.stock < cantidad:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Stock insuficiente para '{producto.nombre}'. Disponible: {producto.stock}, solicitado: {cantidad}"
                )

            precio_unitario = producto.precio
            subtotal_item = (cantidad * precio_unitario).quantize(Decimal("0.01"))

            item = ItemCompra(
                producto_id=producto_id,
                nombre_producto_snapshot=producto.nombre,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                subtotal=subtotal_item
            )
            
            items_validados.append(item)
            subtotal_general += subtotal_item

        return items_validados, subtotal_general.quantize(Decimal("0.01"))

    async def _descontar_stock_productos(self, items: list[ItemCompra]) -> None:
        for item in items:
            resultado = await self.producto_repo.descontar_stock(
                item.producto_id, 
                item.cantidad
            )
            
            if not resultado:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error al descontar stock del producto '{item.nombre_producto_snapshot}'"
                )

    async def crear(self, data: CompraCreate, usuario_id: PydanticObjectId) -> Compras:
        items_validados, subtotal = await self._validar_productos_y_calcular_items(
            [item.model_dump() for item in data.items]
        )

        numero_orden = await self._generar_numero_orden()

        descuento = data.descuento or Decimal("0.00")
        impuestos = data.impuestos or Decimal("0.00")
        total = (subtotal - descuento + impuestos).quantize(Decimal("0.01"))

        if total <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El total de la compra debe ser mayor a 0"
            )

        await self._descontar_stock_productos(items_validados)

        compra = Compras(
            usuario_id=usuario_id,
            numero_orden=numero_orden,
            items=items_validados,
            subtotal=subtotal,
            descuento=descuento,
            impuestos=impuestos,
            total=total,
            estado=EstadoCompraEnum.PENDIENTE,
            notas=data.notas
        )

        try:
            await compra.insert()
        except Exception as e:
            for item in items_validados:
                await self.producto_repo.actualizar_stock(
                    item.producto_id, 
                    item.cantidad
                )
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear la compra. Stock revertido."
            )

        return compra

    async def obtener_por_id(self, id: PydanticObjectId) -> Compras:
        compra = await self.repo.obtener_por_id(id)
        if not compra:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada"
            )
        return compra

    async def obtener_por_numero_orden(self, numero_orden: str) -> Compras:
        compra = await self.repo.obtener_por_numero_orden(numero_orden)
        if not compra:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Compra con número de orden '{numero_orden}' no encontrada"
            )
        return compra

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        return await self.repo.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit
        )

    async def listar_por_estado(
        self,
        estado: EstadoCompraEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        return await self.repo.listar_por_estado(
            estado=estado,
            skip=skip,
            limit=limit
        )

    async def listar_todas(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        return await self.repo.listar_todas(skip=skip, limit=limit)

    async def actualizar_estado(
        self,
        id: PydanticObjectId,
        nuevo_estado: EstadoCompraEnum,
    ) -> Compras:
        compra = await self.obtener_por_id(id)
        
        transiciones_validas = {
            EstadoCompraEnum.PENDIENTE: [EstadoCompraEnum.PAGADO, EstadoCompraEnum.CANCELADO],
            EstadoCompraEnum.PAGADO: [EstadoCompraEnum.ENVIADO, EstadoCompraEnum.CANCELADO],
            EstadoCompraEnum.ENVIADO: [EstadoCompraEnum.ENTREGADO],
            EstadoCompraEnum.ENTREGADO: [],
            EstadoCompraEnum.CANCELADO: [],
        }

        if nuevo_estado not in transiciones_validas.get(compra.estado, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede cambiar el estado de '{compra.estado.value}' a '{nuevo_estado.value}'"
            )

        resultado = await self.repo.actualizar_estado(id, nuevo_estado)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el estado de la compra"
            )
        
        return resultado