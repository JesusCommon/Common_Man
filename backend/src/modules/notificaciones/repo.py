from beanie import PydanticObjectId
from src.modules.notificaciones.document import Notificacion
from src.modules.notificaciones.schema import NotificacionCreate, NotificacionUpdate
from src.shared.repositories.BaseRepo import BaseRepo

MAX_LIMIT = 100

class NotificacionRepo(BaseRepo[Notificacion, NotificacionCreate, NotificacionUpdate]):
    def __init__(self):
        super().__init__(Notificacion)

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
        solo_no_leidas: bool = False,
    ) -> tuple[list[Notificacion], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(self.model.usuario_id == usuario_id)
        
        if solo_no_leidas:
            query = query.find(self.model.leida == False)
            
        total = await query.count()
        
        notificaciones = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return notificaciones, total

    async def contar_no_leidas(self, usuario_id: PydanticObjectId) -> int:
        return await self.model.find(
            self.model.usuario_id == usuario_id,
            self.model.leida == False
        ).count()

    async def marcar_como_leida(
        self, 
        id: PydanticObjectId, 
        usuario_id: PydanticObjectId
    ) -> Notificacion | None:
        resultado = await self.model.find_one(
            self.model.id == id,
            self.model.usuario_id == usuario_id
        ).update({"$set": {self.model.leida: True}})
        
        if resultado.modified_count == 0:
            return None
            
        return await self.obtener_por_id(id)

    async def marcar_todas_como_leidas(self, usuario_id: PydanticObjectId) -> int:
        resultado = await self.model.find(
            self.model.usuario_id == usuario_id,
            self.model.leida == False
        ).update({"$set": {self.model.leida: True}})
        
        return resultado.modified_count

    async def eliminar(self, id: PydanticObjectId, usuario_id: PydanticObjectId) -> bool:
        resultado = await self.model.find_one(
            self.model.id == id,
            self.model.usuario_id == usuario_id
        ).delete()
        return resultado.deleted_count > 0