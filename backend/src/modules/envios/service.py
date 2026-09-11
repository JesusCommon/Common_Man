from datetime import datetime, timezone
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.envios.document import Envios, EstadoEnvioEnum, EventoEnvio
from src.modules.envios.schema import EnvioCreate, EnvioUpdate, EnvioEstadoUpdate
from src.modules.envios.repo import EnvioRepo
from src.modules.compra.document import Compras, EstadoCompraEnum
from src.modules.compra.repo import CompraRepo
from src.modules.direcciones.repo import DireccionRepo
from src.modules.notificaciones.service import NotificacionService
from src.modules.notificaciones.schema import NotificacionCreate
from src.modules.notificaciones.document import TipoNotificacionEnum

TRANSICIONES_VALIDAS: dict[EstadoEnvioEnum, list[EstadoEnvioEnum]] = {
    EstadoEnvioEnum.PENDIENTE: [EstadoEnvioEnum.PREPARANDO, EstadoEnvioEnum.CANCELADO],
    EstadoEnvioEnum.PREPARANDO: [EstadoEnvioEnum.ENVIADO, EstadoEnvioEnum.CANCELADO],
    EstadoEnvioEnum.ENVIADO: [EstadoEnvioEnum.EN_TRANSITO],
    EstadoEnvioEnum.EN_TRANSITO: [EstadoEnvioEnum.ENTREGADO],
    EstadoEnvioEnum.ENTREGADO: [],
    EstadoEnvioEnum.CANCELADO: [],
}

MENSAJES_ESTADO_ENVIO: dict[EstadoEnvioEnum, dict[str, str]] = {
    EstadoEnvioEnum.PREPARANDO: {
        "titulo": "Pedido en preparación",
        "mensaje": "Tu pedido está siendo preparado para el envío.",
    },
    EstadoEnvioEnum.ENVIADO: {
        "titulo": "Pedido enviado",
        "mensaje": "Tu pedido fue despachado. ¡Pronto estará en camino!",
    },
    EstadoEnvioEnum.EN_TRANSITO: {
        "titulo": "Pedido en camino",
        "mensaje": "Tu pedido está en tránsito hacia tu dirección.",
    },
    EstadoEnvioEnum.ENTREGADO: {
        "titulo": "¡Pedido entregado!",
        "mensaje": "Tu pedido fue entregado exitosamente. Gracias por tu compra.",
    },
    EstadoEnvioEnum.CANCELADO: {
        "titulo": "Envío cancelado",
        "mensaje": "El envío de tu pedido fue cancelado.",
    },
}

class EnvioService:
    def __init__(self):
        self.repo = EnvioRepo()
        self.compra_repo = CompraRepo()
        self.direccion_repo = DireccionRepo()
        self.notif_service = NotificacionService()

    async def _validar_transicion_estado(
        self, estado_actual: EstadoEnvioEnum, nuevo_estado: EstadoEnvioEnum
    ) -> None:
        if nuevo_estado not in TRANSICIONES_VALIDAS.get(estado_actual, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede cambiar el estado del envío de '{estado_actual.value}' a '{nuevo_estado.value}'"
            )

    async def _validar_compra_para_envio(self, compra_id: PydanticObjectId) -> Compras:
        compra = await self.compra_repo.obtener_por_id(compra_id)
        
        if not compra:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compra no encontrada"
            )

        if compra.estado != EstadoCompraEnum.PAGADO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede crear un envío para una compra con estado '{compra.estado.value}'. La compra debe estar pagada."
            )

        if await self.repo.existe_envio_para_compra(compra_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Esta compra ya tiene un envío creado"
            )

        return compra

    async def crear(self, data: EnvioCreate) -> Envios:
        compra = await self._validar_compra_para_envio(data.compra_id)

        direccion = await self.direccion_repo.obtener_por_id(data.direccion_id)
        if not direccion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dirección no encontrada"
            )
        
        if direccion.usuario_id != compra.usuario_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La dirección no pertenece al usuario de la compra"
            )

        evento_inicial = EventoEnvio(
            estado=EstadoEnvioEnum.PENDIENTE,
            descripcion="Envío creado"
        )

        envio = Envios(
            compra_id=data.compra_id,
            usuario_id=compra.usuario_id,
            direccion_id=data.direccion_id,
            estado=EstadoEnvioEnum.PENDIENTE,
            notas=data.notas,
            eventos=[evento_inicial]
        )

        await envio.insert()

        await self.notif_service.crear_y_enviar(
            NotificacionCreate(
                usuario_id=compra.usuario_id,
                tipo=TipoNotificacionEnum.ENVIO,
                titulo="Envío creado",
                mensaje=f"Tu orden {compra.numero_orden} está siendo procesada para el envío.",
                referencia_id=envio.id,
                referencia_tipo="envio",
                accion_url="/envios"
            )
        )

        return envio

    async def obtener_por_id(self, id: PydanticObjectId) -> Envios:
        envio = await self.repo.obtener_por_id(id)
        if not envio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Envío no encontrado"
            )
        return envio

    async def obtener_por_compra_id(self, compra_id: PydanticObjectId) -> Envios:
        envio = await self.repo.obtener_por_compra_id(compra_id)
        if not envio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Esta compra no tiene envío"
            )
        return envio

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        return await self.repo.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit
        )

    async def listar_por_estado(
        self,
        estado: EstadoEnvioEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        return await self.repo.listar_por_estado(
            estado=estado,
            skip=skip,
            limit=limit
        )

    async def listar_todos(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        return await self.repo.listar_todos(skip=skip, limit=limit)

    async def actualizar_datos(
        self, id: PydanticObjectId, data: EnvioUpdate
    ) -> Envios:
        envio = await self.obtener_por_id(id)
        resultado = await self.repo.actualizar(id, data)

        if data.numero_seguimiento and data.numero_seguimiento != envio.numero_seguimiento:
            await self.notif_service.crear_y_enviar(
                NotificacionCreate(
                    usuario_id=envio.usuario_id,
                    tipo=TipoNotificacionEnum.ENVIO,
                    titulo="Número de seguimiento disponible",
                    mensaje=f"Tu envío ya tiene número de seguimiento: {data.numero_seguimiento}. Puedes rastrearlo con la transportadora {data.transportadora or 'asignada'}.",
                    referencia_id=envio.id,
                    referencia_tipo="envio",
                    accion_url="/envios"
                )
            )

        return resultado

    async def actualizar_estado(
        self, id: PydanticObjectId, data: EnvioEstadoUpdate
    ) -> Envios:
        envio = await self.obtener_por_id(id)
        await self._validar_transicion_estado(envio.estado, data.estado)

        evento = EventoEnvio(
            estado=data.estado,
            descripcion=data.descripcion
        )

        fecha_entrega_real = None
        if data.estado == EstadoEnvioEnum.ENTREGADO:
            fecha_entrega_real = datetime.now(timezone.utc)

        resultado = await self.repo.actualizar_estado_con_evento(
            id=id,
            nuevo_estado=data.estado,
            evento=evento.model_dump(),
            fecha_entrega_real=fecha_entrega_real
        )
        
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el estado del envío"
            )

        if data.estado in MENSAJES_ESTADO_ENVIO:
            mensaje_config = MENSAJES_ESTADO_ENVIO[data.estado]
            
            mensaje = mensaje_config["mensaje"]
            if data.descripcion:
                mensaje = f"{mensaje} {data.descripcion}"

            await self.notif_service.crear_y_enviar(
                NotificacionCreate(
                    usuario_id=envio.usuario_id,
                    tipo=TipoNotificacionEnum.ENVIO,
                    titulo=mensaje_config["titulo"],
                    mensaje=mensaje,
                    referencia_id=envio.id,
                    referencia_tipo="envio",
                    accion_url="/envios"
                )
            )

        return resultado