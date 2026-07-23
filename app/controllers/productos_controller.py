from beanie import PydanticObjectId
from app.schemas.productos_schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse
)
from app.services.productos_service import ProductoService
from uuid import UUID

class ProductoController:
    def __init__(self):
        self.service = ProductoService()

    async def crear(self, data: ProductoCreate) -> ProductoResponse:
        producto = await self.service.crear(data)
        return ProductoResponse.model_validate(producto)

    async def obtener_id(self, id: PydanticObjectId) -> ProductoResponse:
        producto = await self.service.obtener_por_id(id)
        return ProductoResponse.model_validate(producto)

    async def actualizar(self, id: PydanticObjectId, data: ProductoUpdate) -> ProductoResponse:
        producto = await self.service.actualizar(id, data)
        return ProductoResponse.model_validate(producto)

    async def listar(self) -> list[ProductoResponse]:
        productos = await self.service.listar()
        return [ProductoResponse.model_validate(u) for u in productos]

    async def listar_activos(self) -> list[ProductoResponse]:
        productos = await self.service.listar_activos()
        return [ProductoResponse.model_validate(u) for u in productos]

    async def activar(self, id: PydanticObjectId) -> ProductoResponse:
        producto = await self.service.activar(id)
        return ProductoResponse.model_validate(producto)

    async def desactivar(self, id: PydanticObjectId) -> ProductoResponse:
        producto = await self.service.desactivar(id)
        return ProductoResponse.model_validate(producto)
    
    async def obtener_por_identificador(self, identificador: UUID) -> ProductoResponse:
        usuario = await self.service.obtener_por_identificador(identificador)
        return ProductoResponse.model_validate(usuario)

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        categoria_id: PydanticObjectId | None = None,
        precio_min: float | None = None,
        precio_max: float | None = None,
        disponible: bool | None = None,
        ordenar_por: str = "fecha_creacion",
        orden_desc: bool = True,
        skip: int = 0,
        limit: int = 20,
    ) -> list[ProductoResponse]:
        productos = await self.service.buscar_por_filtro(
            nombre=nombre,
            categoria_id=categoria_id,
            precio_min=precio_min,
            precio_max=precio_max,
            disponible=disponible,
            ordenar_por=ordenar_por,
            orden_desc=orden_desc,
            skip=skip,
            limit=limit,
        )
        return [ProductoResponse.model_validate(u) for u in productos]