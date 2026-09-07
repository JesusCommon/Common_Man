from beanie import PydanticObjectId
from src.modules.direcciones.document import Direcciones
from src.modules.direcciones.schema import DireccionCreate, DireccionUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

MAX_LIMIT = 100

class DireccionRepo(BaseRepoConEstado[Direcciones, DireccionCreate, DireccionUpdate]):
    def __init__(self):
        super().__init__(Direcciones)

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
        solo_activas: bool = True,
    ) -> tuple[list[Direcciones], int]:

        limit = min(limit, MAX_LIMIT)
        
        if solo_activas:
            query = self.model.find(
                self.model.usuario_id == usuario_id,
                self.model.activo == True
            )
        else:
            query = self.model.find(self.model.usuario_id == usuario_id)
        
        total = await query.count()
        
        direcciones = (
            await query
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        
        return direcciones, total

    async def obtener_predeterminada(
        self, usuario_id: PydanticObjectId
    ) -> Direcciones | None:
        return await self.model.find_one(
            self.model.usuario_id == usuario_id,
            self.model.es_predeterminada == True,
            self.model.activo == True
        )

    async def desmarcar_predeterminada(self, usuario_id: PydanticObjectId) -> None:
        await self.model.find(
            self.model.usuario_id == usuario_id,
            self.model.es_predeterminada == True
        ).update({"$set": {self.model.es_predeterminada: False}})

    async def marcar_predeterminada(self, id: PydanticObjectId) -> Direcciones | None:
        resultado = await self.model.find_one(self.model.id == id).update(
            {"$set": {self.model.es_predeterminada: True}}
        )
        
        if resultado.modified_count == 0:
            return None
        
        return await self.obtener_por_id(id)

    async def contar_por_usuario(self, usuario_id: PydanticObjectId) -> int:
        return await self.model.find(
            self.model.usuario_id == usuario_id,
            self.model.activo == True
        ).count()

    async def verificar_alias_duplicado(
        self,
        usuario_id: PydanticObjectId,
        alias: str,
        excluir_id: PydanticObjectId | None = None,
    ) -> bool:
        if excluir_id:
            return await self.model.find_one(
                self.model.usuario_id == usuario_id,
                self.model.alias == alias,
                self.model.id != excluir_id,
                self.model.activo == True
            ) is not None
        
        return await self.model.find_one(
            self.model.usuario_id == usuario_id,
            self.model.alias == alias,
            self.model.activo == True
        ) is not None