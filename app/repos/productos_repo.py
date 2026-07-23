from app.models.productos_model import Producto
from app.schemas.productos_schema import ProductoCreate, ProductoUpdate
from app.repos.base_repo import BaseRepoConEstado
from uuid import UUID
from beanie import PydanticObjectId

class ProductoRepo(BaseRepoConEstado[Producto, ProductoCreate, ProductoUpdate]):
    def __init__(self):
        super().__init__(Producto)

    async def obtener_por_nombre(self, nombre: str) -> Producto | None:
        return await Producto.find_one(Producto.nombre == nombre)

    async def obtener_por_codigo(self, codigo: str) -> Producto | None:
        return await Producto.find_one(Producto.codigo == codigo)

    async def obtener_por_identificador(self, identificador: UUID) -> Producto | None:
        return await Producto.find_one(Producto.identificador == identificador)

    async def buscar_con_filtros(
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
    ) -> list[Producto]:
        query = {}

        if nombre:
            query["nombre"] = {"$regex": nombre, "$options": "i"}
        if categoria_id:
            query["categoria.$id"] = categoria_id
        if disponible is not None:
            query["disponible"] = disponible
        if precio_min is not None or precio_max is not None:
            query["precio"] = {}
            if precio_min is not None:
                query["precio"]["$gte"] = precio_min
            if precio_max is not None:
                query["precio"]["$lte"] = precio_max

        campo_orden = f"-{ordenar_por}" if orden_desc else ordenar_por

        return (
            await Producto.find(query)
            .sort(campo_orden)
            .skip(skip)
            .limit(limit)
            .to_list()
        )