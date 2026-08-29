from decimal import Decimal
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.pagos.document import MovimientoSaldo, TipoMovimientoEnum, EstadoMovimientoEnum
from src.modules.pagos.repo import MovimientoSaldoRepo
from src.modules.compra.document import Compras, EstadoCompraEnum
from src.modules.compra.repo import CompraRepo
from src.modules.usuarios.document import Usuario
from src.modules.productos.repo import ProductoRepo
from src.modules.config_finanzas.document import ConfiguracionSistema

class PagoService:
    def __init__(self):
        self.repo = MovimientoSaldoRepo()
        self.compra_repo = CompraRepo()
        self.producto_repo = ProductoRepo()

    async def _obtener_o_crear_configuracion(self) -> ConfiguracionSistema:
        config = await ConfiguracionSistema.find_one()
        if not config:
            config = ConfiguracionSistema(
                saldo_plataforma=Decimal("0.00"),
                total_transacciones=0
            )
            await config.insert()
        return config

    async def _validar_compra_para_pago(
        self, compra_id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Compras:
        compra = await self.compra_repo.obtener_por_id(compra_id)
        
        if not compra:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada"
            )
        
        if compra.estado != EstadoCompraEnum.PENDIENTE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La compra no está pendiente. Estado actual: {compra.estado.value}"
            )
        
        if compra.usuario_id != usuario_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para pagar esta compra"
            )
        
        return compra

    async def _validar_saldo_suficiente(
        self, usuario_id: PydanticObjectId, monto: Decimal
    ) -> Usuario:
        usuario = await Usuario.get(usuario_id)
        
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        if usuario.saldo < monto:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Saldo insuficiente. Disponible: {usuario.saldo}, requerido: {monto}"
            )
        
        return usuario

    async def procesar_pago(
        self, compra_id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> MovimientoSaldo:

        compra = await self._validar_compra_para_pago(compra_id, usuario_id)
        if await self.repo.existe_pago_para_compra(compra_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Esta compra ya fue pagada"
            )

        usuario = await self._validar_saldo_suficiente(usuario_id, compra.total)

        saldo_anterior = usuario.saldo
        saldo_posterior = saldo_anterior - compra.total

        resultado_update = await Usuario.find_one(Usuario.id == usuario_id).update(
            {"$inc": {"saldo": -compra.total}}
        )

        if resultado_update.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al descontar el saldo"
            )

        movimiento = MovimientoSaldo(
            usuario_id=usuario_id,
            compra_id=compra_id,
            tipo=TipoMovimientoEnum.PAGO_COMPRA,
            estado=EstadoMovimientoEnum.EXITOSO,
            monto=-compra.total,
            saldo_anterior=saldo_anterior,
            saldo_posterior=saldo_posterior,
            descripcion=f"Pago de compra {compra.numero_orden}"
        )

        try:
            await movimiento.insert()
        except Exception as e:
            await Usuario.find_one(Usuario.id == usuario_id).update(
                {"$inc": {"saldo": compra.total}}
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al registrar el movimiento. Saldo revertido."
            )

        resultado_estado = await self.compra_repo.actualizar_estado(
            compra_id, EstadoCompraEnum.PAGADO
        )

        if not resultado_estado:
            await Usuario.find_one(Usuario.id == usuario_id).update(
                {"$inc": {"saldo": compra.total}}
            )
            await movimiento.update({"$set": {"estado": EstadoMovimientoEnum.REVERTIDO}})
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el estado de la compra. Transacción revertida."
            )

        config = await self._obtener_o_crear_configuracion()
        await ConfiguracionSistema.find_one().update(
            {"$inc": {
                "saldo_plataforma": compra.total,
                "total_transacciones": 1
            }}
        )

        return movimiento

    async def cancelar_compra(
        self, compra_id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Compras:
        compra = await self.compra_repo.obtener_por_id(compra_id)
        
        if not compra:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada"
            )
        
        if compra.usuario_id != usuario_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para cancelar esta compra"
            )
        
        if compra.estado == EstadoCompraEnum.CANCELADO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La compra ya está cancelada"
            )

        if compra.estado == EstadoCompraEnum.ENTREGADO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede cancelar una compra que ya fue entregada"
            )

        if compra.estado == EstadoCompraEnum.PENDIENTE:
            for item in compra.items:
                await self.producto_repo.actualizar_stock(
                    item.producto_id, item.cantidad
                )

        elif compra.estado == EstadoCompraEnum.PAGADO:
            usuario = await Usuario.get(usuario_id)
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado para el reembolso"
                )

            saldo_anterior = usuario.saldo
            monto_reembolso = compra.total
            saldo_posterior = saldo_anterior + monto_reembolso

            resultado_update = await Usuario.find_one(Usuario.id == usuario_id).update(
                {"$inc": {"saldo": monto_reembolso}}
            )

            if resultado_update.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Error al procesar el reembolso del saldo"
                )

            movimiento_reembolso = MovimientoSaldo(
                usuario_id=usuario_id,
                compra_id=compra_id,
                tipo=TipoMovimientoEnum.REEMBOLSO,
                estado=EstadoMovimientoEnum.EXITOSO,
                monto=monto_reembolso,
                saldo_anterior=saldo_anterior,
                saldo_posterior=saldo_posterior,
                descripcion=f"Reembolso por cancelación de compra {compra.numero_orden}"
            )
            await movimiento_reembolso.insert()

            config = await self._obtener_o_crear_configuracion()
            await ConfiguracionSistema.find_one().update(
                {"$inc": {
                    "saldo_plataforma": -monto_reembolso,
                    "total_transacciones": 1
                }}
            )

            for item in compra.items:
                await self.producto_repo.actualizar_stock(
                    item.producto_id, item.cantidad
                )

        resultado = await self.compra_repo.actualizar_estado(
            compra_id, EstadoCompraEnum.CANCELADO
        )
        
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el estado de la compra a cancelado"
            )
        
        return resultado

    async def obtener_movimiento_por_compra(
        self, compra_id: PydanticObjectId
    ) -> MovimientoSaldo:
        movimiento = await self.repo.obtener_por_compra_id(compra_id)
        
        if not movimiento:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró movimiento de pago para esta compra"
            )
        
        return movimiento

    async def listar_historial_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[MovimientoSaldo], int]:
        return await self.repo.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit
        )