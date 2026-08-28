from beanie import PydanticObjectId
from src.modules.compra.document import Compras, EstadoCompraEnum
from src.modules.compra.schema import CompraCreate, CompraUpdate
from src.shared.repositories.BaseRepo import BaseRepo

MAX_LIMIT = 100

class CompraRepo(BaseRepo[Compras, CompraCreate, CompraUpdate]):    
    def __init__(self):
        super().__init__(Compras)

    async def obtener_por_numero_orden(self, numero_orden: str) -> Compras | None:
        return await self.model.find_one(self.model.numero_orden == numero_orden)

    async def numero_orden_existe(self, numero_orden: str) -> bool:
        return await self.model.find_one(self.model.numero_orden == numero_orden) is not None

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(self.model.usuario_id == usuario_id)
        total = await query.count()
        
        compras = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return compras, total

    async def listar_por_estado(
        self,
        estado: EstadoCompraEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find(self.model.estado == estado)
        total = await query.count()
        
        compras = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return compras, total

    async def listar_todas(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        limit = min(limit, MAX_LIMIT)
        query = self.model.find()
        total = await query.count()
        
        compras = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return compras, total

    async def actualizar_estado(
        self,
        id: PydanticObjectId,
        nuevo_estado: EstadoCompraEnum,
    ) -> Compras | None:
        resultado = await self.model.find_one(self.model.id == id).update(
            {"$set": {self.model.estado: nuevo_estado}}
        )
        
        if resultado.modified_count == 0:
            return None
        
        return await self.obtener_por_id(id)