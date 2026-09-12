from beanie import PydanticObjectId
from src.modules.reportes.document import Reporte, EstadoReporteEnum
from src.modules.reportes.schema import (
    ReporteCreate,
    MensajeCreate,
    ReporteEstadoUpdate,
)
from src.modules.reportes.services import ReporteService
from src.modules.usuarios.document import Usuario

class ReporteController:
    def __init__(self):
        self.service = ReporteService()

    async def crear_reporte(self, data: ReporteCreate, usuario: Usuario) -> Reporte:
        return await self.service.crear_reporte(data, usuario)

    async def responder_reporte_usuario(
        self,
        reporte_id: PydanticObjectId,
        data: MensajeCreate,
        usuario: Usuario,
    ) -> Reporte:
        return await self.service.responder_reporte_usuario(reporte_id, data, usuario)

    async def eliminar_reporte_usuario(
        self,
        reporte_id: PydanticObjectId,
        usuario_id: PydanticObjectId,
    ) -> bool:
        return await self.service.eliminar_reporte_usuario(reporte_id, usuario_id)

    async def obtener_reporte_usuario(
        self,
        reporte_id: PydanticObjectId,
        usuario_id: PydanticObjectId,
    ) -> Reporte:
        return await self.service.obtener_por_id(reporte_id, usuario_id)

    async def listar_reportes_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        return await self.service.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit,
        )

    async def responder_reporte_admin(
        self,
        reporte_id: PydanticObjectId,
        data: MensajeCreate,
        admin: Usuario,
    ) -> Reporte:
        return await self.service.responder_reporte_admin(reporte_id, data, admin)

    async def actualizar_estado_admin(
        self,
        reporte_id: PydanticObjectId,
        data: ReporteEstadoUpdate,
        admin: Usuario,
    ) -> Reporte:
        return await self.service.actualizar_estado_admin(reporte_id, data, admin)

    async def eliminar_reporte_admin(self, reporte_id: PydanticObjectId) -> bool:
        return await self.service.eliminar_reporte_admin(reporte_id)

    async def obtener_reporte_admin(self, reporte_id: PydanticObjectId) -> Reporte:
        return await self.service.obtener_por_id(reporte_id, usuario_id=None)

    async def listar_reportes_admin(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        return await self.service.listar_todos(skip=skip, limit=limit)

    async def listar_reportes_por_estado_admin(
        self,
        estado: EstadoReporteEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        return await self.service.listar_por_estado(
            estado=estado,
            skip=skip,
            limit=limit,
        )