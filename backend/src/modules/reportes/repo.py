from beanie import PydanticObjectId
from src.modules.reportes.document import (
    Reporte,
    EstadoReporteEnum,
    MensajeReporte,
)
from src.modules.reportes.schema import ReporteCreate
from src.shared.repositories.BaseRepo import BaseRepo

MAX_LIMIT = 100

class ReporteRepo(BaseRepo[Reporte, ReporteCreate, None]):
    def __init__(self):
        super().__init__(Reporte)

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(self.model.usuario_id == usuario_id)
        total = await query.count()

        reportes = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return reportes, total

    async def listar_todos(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find()
        total = await query.count()

        reportes = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return reportes, total

    async def listar_por_estado(
        self,
        estado: EstadoReporteEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Reporte], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(self.model.estado == estado)
        total = await query.count()

        reportes = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return reportes, total

    async def agregar_mensaje(
        self,
        reporte_id: PydanticObjectId,
        mensaje: MensajeReporte,
    ) -> Reporte | None:
        resultado = await self.model.find_one(
            self.model.id == reporte_id
        ).update(
            {"$push": {"mensajes": mensaje.model_dump()}}
        )

        if resultado.modified_count == 0:
            return None

        return await self.obtener_por_id(reporte_id)

    async def actualizar_estado(
        self,
        reporte_id: PydanticObjectId,
        nuevo_estado: EstadoReporteEnum,
        fecha_cierre=None,
    ) -> Reporte | None:
        update_data = {"estado": nuevo_estado}
        
        if fecha_cierre is not None:
            update_data["fecha_cierre"] = fecha_cierre

        resultado = await self.model.find_one(
            self.model.id == reporte_id
        ).update({"$set": update_data})

        if resultado.modified_count == 0:
            return None

        return await self.obtener_por_id(reporte_id)

    async def eliminar(self, reporte_id: PydanticObjectId) -> bool:
        resultado = await self.model.find_one(
            self.model.id == reporte_id
        ).delete()
        return resultado.deleted_count > 0