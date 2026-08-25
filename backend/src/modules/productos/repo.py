import re
from decimal import Decimal
from beanie import PydanticObjectId
from src.modules.productos.document import Productos
from src.modules.productos.schema import ProductoCreate, ProductoUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

MAX_LIMIT = 100


class ProductoRepo(BaseRepoConEstado[Productos, ProductoCreate, ProductoUpdate]):
    def __init__(self):
        super().__init__(Productos)

    async def obtener_por_slug(self, slug: str) -> Productos | None:
        return await self.model.find_one(self.model.slug == slug)

    async def slug_existe(self, slug: str, excluir_id: PydanticObjectId | None = None) -> bool:
        if excluir_id:
            return await self.model.find_one(
                self.model.slug == slug,
                self.model.id != excluir_id
            ) is not None
        return await self.model.find_one(self.model.slug == slug) is not None

    async def listar_por_categoria(
        self,
        categoria_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
        solo_activos: bool = True,
    ) -> tuple[list[Productos], int]:
        if solo_activos:
            query = self.model.find(
                self.model.categoria_id == categoria_id,
                self.model.activo == True
            )
        else:
            query = self.model.find(self.model.categoria_id == categoria_id)

        total = await query.count()
        productos = (
            await query
            .sort(-self.model.id)
            .skip(skip)
            .limit(min(limit, MAX_LIMIT))
            .to_list()
        )
        return productos, total

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
        limit = min(limit, MAX_LIMIT)
        
        query_dict = {}
        
        if nombre:
            query_dict["nombre"] = {"$regex": re.escape(nombre), "$options": "i"}
        if categoria_id:
            query_dict["categoria_id"] = categoria_id
        if precio_min is not None or precio_max is not None:
            query_dict["precio"] = {}
            if precio_min is not None:
                query_dict["precio"]["$gte"] = precio_min
            if precio_max is not None:
                query_dict["precio"]["$lte"] = precio_max
        if stock_min is not None:
            query_dict["stock"] = {"$gte": stock_min}
        if solo_activos:
            query_dict["activo"] = True

        query = self.model.find(query_dict)
        total = await query.count()
        productos = (
            await query
            .sort(-self.model.id)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
        return productos, total

    async def actualizar_stock(
        self, id: PydanticObjectId, delta: int
    ) -> Productos | None:
        resultado = await self.model.find_one(
            self.model.id == id,
            self.model.activo == True
        ).update({"$inc": {self.model.stock: delta}})

        if resultado.modified_count == 0:
            return None

        return await self.obtener_por_id(id)

    async def descontar_stock(
        self, id: PydanticObjectId, cantidad: int
    ) -> Productos | None:
        filtro = {
            "_id": id,
            "activo": True,
            "stock": {"$gte": cantidad},
        }
        resultado = await self.model.find_one(filtro).update(
            {"$inc": {"stock": -cantidad}}
        )

        if resultado.modified_count == 0:
            return None

        return await self.obtener_por_id(id)

    async def establecer_stock(
        self, id: PydanticObjectId, nuevo_stock: int
    ) -> Productos | None:
        if nuevo_stock < 0:
            raise ValueError("El stock no puede ser negativo")

        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        documento.stock = nuevo_stock
        await documento.save()
        return documento

    async def obtener_recientes(self, limit: int = 10) -> list[Productos]:
        return (
            await self.model.find(self.model.activo == True)
            .sort(-self.model.fecha_creacion)
            .limit(min(limit, MAX_LIMIT))
            .to_list()
        )