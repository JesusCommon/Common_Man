from datetime import datetime, timezone
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.reportes.document import (
    Reporte,
    EstadoReporteEnum,
    RolMensajeEnum,
    MensajeReporte,
)
from src.modules.reportes.schema import (
    ReporteCreate,
    MensajeCreate,
    ReporteEstadoUpdate,
)
from src.modules.reportes.repo import ReporteRepo
from src.modules.usuarios.document import Usuario
from src.modules.notificaciones.service import NotificacionService
from src.modules.notificaciones.schema import NotificacionCreate
from src.modules.notificaciones.document import TipoNotificacionEnum


class ReporteService:
    def __init__(self):
        self.repo = ReporteRepo()
        self.notif_service = NotificacionService()

    async def _validar_propiedad_reporte(
        self,
        reporte_id: PydanticObjectId,
        usuario_id: PydanticObjectId,
    ) -> Reporte:
        reporte = await self.repo.obtener_por_id(reporte_id)
        
        if not reporte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reporte no encontrado"
            )

        if reporte.usuario_id != usuario_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para acceder a este reporte"
            )

        return reporte

    async def _validar_estado_para_mensaje(
        self,
        estado: EstadoReporteEnum,
    ) -> None:
        if estado in (EstadoReporteEnum.RESUELTO, EstadoReporteEnum.CERRADO):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pueden agregar mensajes a un reporte resuelto o cerrado"
            )

    async def crear_reporte(
        self,
        data: ReporteCreate,
        usuario: Usuario,
    ) -> Reporte:
        reporte = Reporte(
            usuario_id=usuario.id,
            categoria=data.categoria,
            asunto=data.asunto,
            descripcion=data.descripcion,
            codigo_referencia=data.codigo_referencia,
            estado=EstadoReporteEnum.ABIERTO,
        )

        await reporte.insert()

        await self.notif_service.crear_y_enviar(
            NotificacionCreate(
                usuario_id=usuario.id,
                tipo=TipoNotificacionEnum.SOPORTE,
                titulo="Reporte creado",
                mensaje=f"Tu reporte '{data.asunto}' fue registrado correctamente. Un administrador lo revisará pronto.",
                referencia_id=reporte.id,
                referencia_tipo="reporte",
                accion_url=f"/soporte/{reporte.id}",
            )
        )

        return reporte

    async def responder_reporte_usuario(
        self,
        reporte_id: PydanticObjectId,
        data: MensajeCreate,
        usuario: Usuario,
    ) -> Reporte:
        reporte = await self._validar_propiedad_reporte(reporte_id, usuario.id)
        await self._validar_estado_para_mensaje(reporte.estado)

        mensaje = MensajeReporte(
            usuario_id=usuario.id,
            nombre_usuario=f"{usuario.nombre} {usuario.apellido or ''}".strip(),
            rol=RolMensajeEnum.USUARIO,
            contenido=data.contenido,
        )

        resultado = await self.repo.agregar_mensaje(reporte_id, mensaje)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al agregar el mensaje"
            )

        await self.notif_service.crear_y_enviar(
            NotificacionCreate(
                usuario_id=usuario.id,
                tipo=TipoNotificacionEnum.SOPORTE,
                titulo="Mensaje enviado",
                mensaje=f"Tu respuesta en el reporte '{reporte.asunto}' fue enviada. Un administrador la revisará.",
                referencia_id=reporte.id,
                referencia_tipo="reporte",
                accion_url=f"/soporte/{reporte.id}",
            )
        )

        return resultado

    async def eliminar_reporte_usuario(
        self,
        reporte_id: PydanticObjectId,
        usuario_id: PydanticObjectId,
    ) -> bool:
        await self._validar_propiedad_reporte(reporte_id, usuario_id)
        
        resultado = await self.repo.eliminar(reporte_id)
        
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el reporte"
            )

        return True

    async def responder_reporte_admin(
        self,
        reporte_id: PydanticObjectId,
        data: MensajeCreate,
        admin: Usuario,
    ) -> Reporte:
        reporte = await self.repo.obtener_por_id(reporte_id)
        
        if not reporte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reporte no encontrado"
            )

        await self._validar_estado_para_mensaje(reporte.estado)

        if reporte.estado == EstadoReporteEnum.ABIERTO:
            await self.repo.actualizar_estado(
                reporte_id,
                EstadoReporteEnum.EN_PROGRESO,
            )

        mensaje = MensajeReporte(
            usuario_id=admin.id,
            nombre_usuario=f"{admin.nombre} {admin.apellido or ''}".strip(),
            rol=RolMensajeEnum.ADMIN,
            contenido=data.contenido,
        )

        resultado = await self.repo.agregar_mensaje(reporte_id, mensaje)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al agregar el mensaje"
            )

        await self.notif_service.crear_y_enviar(
            NotificacionCreate(
                usuario_id=reporte.usuario_id,
                tipo=TipoNotificacionEnum.SOPORTE,
                titulo="Respuesta de soporte",
                mensaje=f"Tienes una respuesta en tu reporte '{reporte.asunto}'.",
                referencia_id=reporte.id,
                referencia_tipo="reporte",
                accion_url=f"/soporte/{reporte.id}",
            )
        )

        return resultado

    async def actualizar_estado_admin(
        self,
        reporte_id: PydanticObjectId,
        data: ReporteEstadoUpdate,
        admin: Usuario,
    ) -> Reporte:
        reporte = await self.repo.obtener_por_id(reporte_id)
        
        if not reporte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reporte no encontrado"
            )

        if data.estado == reporte.estado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El reporte ya está en estado '{data.estado.value}'"
            )

        if reporte.estado == EstadoReporteEnum.CERRADO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede modificar un reporte cerrado"
            )

        fecha_cierre = None
        if data.estado in (EstadoReporteEnum.RESUELTO, EstadoReporteEnum.CERRADO):
            fecha_cierre = datetime.now(timezone.utc)

        resultado = await self.repo.actualizar_estado(
            reporte_id,
            data.estado,
            fecha_cierre,
        )

        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al actualizar el estado del reporte"
            )

        if data.mensaje_resolucion:
            mensaje = MensajeReporte(
                usuario_id=admin.id,
                nombre_usuario=f"{admin.nombre} {admin.apellido or ''}".strip(),
                rol=RolMensajeEnum.ADMIN,
                contenido=data.mensaje_resolucion,
            )
            await self.repo.agregar_mensaje(reporte_id, mensaje)
            resultado = await self.repo.obtener_por_id(reporte_id)

        mensajes_estado = {
            EstadoReporteEnum.EN_PROGRESO: "Tu reporte está siendo atendido por nuestro equipo.",
            EstadoReporteEnum.RESUELTO: "Tu reporte fue resuelto. Gracias por contactarnos.",
            EstadoReporteEnum.CERRADO: "Tu reporte fue cerrado.",
        }

        if data.estado in mensajes_estado:
            await self.notif_service.crear_y_enviar(
                NotificacionCreate(
                    usuario_id=reporte.usuario_id,
                    tipo=TipoNotificacionEnum.SOPORTE,
                    titulo=f"Reporte {data.estado.value.replace('_', ' ')}",
                    mensaje=f"{mensajes_estado[data.estado]} Reporte: '{reporte.asunto}'.",
                    referencia_id=reporte.id,
                    referencia_tipo="reporte",
                    accion_url=f"/soporte/{reporte.id}",
                )
            )

        return resultado

    async def eliminar_reporte_admin(
        self,
        reporte_id: PydanticObjectId,
    ) -> bool:
        reporte = await self.repo.obtener_por_id(reporte_id)
        
        if not reporte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reporte no encontrado"
            )

        resultado = await self.repo.eliminar(reporte_id)
        
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al eliminar el reporte"
            )

        return True

    async def obtener_por_id(
        self,
        reporte_id: PydanticObjectId,
        usuario_id: PydanticObjectId | None = None,
    ) -> Reporte:
        if usuario_id:
            return await self._validar_propiedad_reporte(reporte_id, usuario_id)
        
        reporte = await self.repo.obtener_por_id(reporte_id)
        if not reporte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reporte no encontrado"
            )
        return reporte

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        return await self.repo.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit,
        )

    async def listar_todos(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        return await self.repo.listar_todos(skip=skip, limit=limit)

    async def listar_por_estado(
        self,
        estado: EstadoReporteEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        return await self.repo.listar_por_estado(
            estado=estado,
            skip=skip,
            limit=limit,
        )