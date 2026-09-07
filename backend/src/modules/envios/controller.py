from beanie import PydanticObjectId
from src.modules.envios.document import Envios, EstadoEnvioEnum
from src.modules.envios.schema import EnvioCreate, EnvioUpdate, EnvioEstadoUpdate
from src.modules.envios.service import EnvioService

class EnvioController:
    def __init__(self):
        self.service = EnvioService()

    async def crear(self, data: EnvioCreate) -> Envios:
        return await self.service.crear(data)

    async def obtener_por_id(self, id: PydanticObjectId) -> Envios:
        return await self.service.obtener_por_id(id)

    async def obtener_por_compra_id(self, compra_id: PydanticObjectId) -> Envios:
        return await self.service.obtener_por_compra_id(compra_id)

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        return await self.service.listar_por_usuario(
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
        return await self.service.listar_por_estado(
            estado=estado,
            skip=skip,
            limit=limit
        )

    async def listar_todos(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Envios], int]:
        return await self.service.listar_todos(skip=skip, limit=limit)

    async def actualizar_datos(
        self, id: PydanticObjectId, data: EnvioUpdate
    ) -> Envios:
        return await self.service.actualizar_datos(id, data)

    async def actualizar_estado(
        self, id: PydanticObjectId, data: EnvioEstadoUpdate
    ) -> Envios:
        return await self.service.actualizar_estado(id, data)