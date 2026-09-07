from datetime import datetime
from beanie import PydanticObjectId
from src.modules.envios.document import Envios, EstadoEnvioEnum
from src.modules.envios.schema import EnvioCreate, EnvioUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

MAX_LIMIT = 100

class EnvioRepo(BaseRepoConEstado[Envios, EnvioCreate, EnvioUpdate]):
    def __init__(self):
        super().__init__(Envios)

    async def obtener_por_compra_id(self, compra_id: PydanticObjectId) -> Envios | None:
        return await self.model.find_one(self.model.compra_id == compra_id)

    async def existe_envio_para_compra(self, compra_id: PydanticObjectId) -> bool:
        return await self.model.find_one(self.model.compra_id == compra_id) is not None

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(
            self.model.usuario_id == usuario_id,
            self.model.activo == True
        )
        total = await query.count()
        
        envios = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        
        return envios, total

    async def listar_por_estado(
        self,
        estado: EstadoEnvioEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(
            self.model.estado == estado,
            self.model.activo == True
        )
        total = await query.count()
        
        envios = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        
        return envios, total

    async def listar_todos(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find()
        total = await query.count()
        
        envios = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        
        return envios, total

    async def obtener_por_numero_seguimiento(self, numero_seguimiento: str) -> Envios | None:
        return await self.model.find_one(self.model.numero_seguimiento == numero_seguimiento)

    async def actualizar_estado_con_evento(
        self,
        id: PydanticObjectId,
        nuevo_estado: EstadoEnvioEnum,
        evento: dict,
        fecha_entrega_real: datetime | None = None,
    ) -> Envios | None:
        update_dict = {
            "$set": {self.model.estado: nuevo_estado},
            "$push": {self.model.eventos: evento}
        }
        
        if fecha_entrega_real:
            update_dict["$set"][self.model.fecha_entrega_real] = fecha_entrega_real
        
        resultado = await self.model.find_one(self.model.id == id).update(update_dict)
        
        if resultado.modified_count == 0:
            return None
        
        return await self.obtener_por_id(id)