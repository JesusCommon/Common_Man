from decimal import Decimal
from beanie import PydanticObjectId
from src.modules.productos.document import Productos
from src.modules.productos.schema import ProductoCreate, ProductoUpdate
from src.modules.productos.service import ProductoService

class ProductoController:
    def __init__(self):
        self.service = ProductoService()

    async def obtener_por_slug(self, slug: str) -> Productos:
        return await self.service.obtener_por_slug(slug)

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Productos], int]:
        return await self.service.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Productos], int]:
        return await self.service.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Productos], int]:
        return await self.service.listar_inactivos(skip=skip, limit=limit)

    async def listar_por_categoria(
        self,
        categoria_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
        solo_activos: bool = True,
    ) -> tuple[list[Productos], int]:
        return await self.service.listar_por_categoria(
            categoria_id=categoria_id,
            skip=skip,
            limit=limit,
            solo_activos=solo_activos,
        )

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        categoria_id: PydanticObjectId | None = None,
        precio_min: Decimal | None = None,
        precio_max: Decimal | None = None,
        stock_min: int | None = None,
        solo_activos: bool = True,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Productos], int]:
        return await self.service.buscar_por_filtro(
            nombre=nombre,
            categoria_id=categoria_id,
            precio_min=precio_min,
            precio_max=precio_max,
            stock_min=stock_min,
            solo_activos=solo_activos,
            skip=skip,
            limit=limit,
        )

    async def obtener_recientes(self, limit: int = 10) -> list[Productos]:
        return await self.service.obtener_recientes(limit=limit)

    async def crear(self, data: ProductoCreate) -> Productos:
        return await self.service.crear(data)

    async def obtener_por_id(self, id: PydanticObjectId) -> Productos:
        return await self.service.obtener_por_id(id)

    async def actualizar(self, id: PydanticObjectId, data: ProductoUpdate) -> Productos:
        return await self.service.actualizar(id, data)

    async def actualizar_stock(self, id: PydanticObjectId, delta: int) -> Productos:
        return await self.service.actualizar_stock(id, delta)

    async def descontar_stock(self, id: PydanticObjectId, cantidad: int) -> Productos:
        return await self.service.descontar_stock(id, cantidad)

    async def establecer_stock(self, id: PydanticObjectId, nuevo_stock: int) -> Productos:
        return await self.service.establecer_stock(id, nuevo_stock)

    async def activar(self, id: PydanticObjectId) -> Productos:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Productos:
        return await self.service.desactivar(id)