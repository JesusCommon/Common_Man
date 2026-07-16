from app.models.tienda_model import ProductoTienda
from app.schemas.tienda_schema import TiendaCreate, TiendaUpdate
from app.repos.base_repo import BaseRepoConEstado
from uuid import UUID
from beanie import PydanticObjectId

class TiendaRepo(BaseRepoConEstado[ProductoTienda, TiendaCreate, TiendaUpdate]):
    def __init__(self):
        super().__init__(ProductoTienda)

    async def obtener_por_nombre(self, nombre: str) -> ProductoTienda | None:
        return await ProductoTienda.find_one(ProductoTienda.nombre == nombre)

    async def obtener_por_codigo(self, codigo: str) -> ProductoTienda | None:
        return await ProductoTienda.find_one(ProductoTienda.codigo == codigo)

    async def obtener_por_identificador(self, identificador: UUID) -> ProductoTienda | None:
        return await ProductoTienda.find_one(ProductoTienda.identificador == identificador)

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
    ) -> list[ProductoTienda]:
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
            await ProductoTienda.find(query)
            .sort(campo_orden)
            .skip(skip)
            .limit(limit)
            .to_list()
        )