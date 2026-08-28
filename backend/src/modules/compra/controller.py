from beanie import PydanticObjectId
from src.modules.compra.document import Compras, EstadoCompraEnum
from src.modules.compra.schema import CompraCreate
from src.modules.compra.service import CompraService

class CompraController:
    def __init__(self):
        self.service = CompraService()

    async def crear(self, data: CompraCreate, usuario_id: PydanticObjectId) -> Compras:
        return await self.service.crear(data, usuario_id)

    async def obtener_por_id(self, id: PydanticObjectId) -> Compras:
        return await self.service.obtener_por_id(id)

    async def obtener_por_numero_orden(self, numero_orden: str) -> Compras:
        return await self.service.obtener_por_numero_orden(numero_orden)

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        return await self.service.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit
        )

    async def listar_por_estado(
        self,
        estado: EstadoCompraEnum,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        return await self.service.listar_por_estado(
            estado=estado,
            skip=skip,
            limit=limit
        )

    async def listar_todas(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Compras], int]:
        return await self.service.listar_todas(skip=skip, limit=limit)

    async def actualizar_estado(
        self,
        id: PydanticObjectId,
        nuevo_estado: EstadoCompraEnum,
    ) -> Compras:
        return await self.service.actualizar_estado(id, nuevo_estado)