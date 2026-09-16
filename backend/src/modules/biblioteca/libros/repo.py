import re
from decimal import Decimal
from beanie import PydanticObjectId
from src.modules.biblioteca.libros.document import Libro, Idiomas
from src.modules.biblioteca.libros.schema import LibroCreate, LibroUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

MAX_LIMIT = 100

class LibroRepo(BaseRepoConEstado[Libro, LibroCreate, LibroUpdate]):
    def __init__(self):
        super().__init__(Libro)

    async def obtener_por_isbn(self, isbn: str) -> Libro | None:
        return await self.model.find_one(self.model.isbn == isbn)

    async def obtener_por_sku(self, sku: str) -> Libro | None:
        return await self.model.find_one(self.model.sku == sku)

    async def obtener_por_datos_unicos(
        self,
        nombre: str,
        autor_id: PydanticObjectId,
        editorial_id: PydanticObjectId,
        genero_id: PydanticObjectId,
        edicion: str | None,
        anio_publicacion: int,
    ) -> Libro | None:
        return await self.model.find_one(
            {
                "nombre": nombre,
                "autor_id": autor_id,
                "editorial_id": editorial_id,
                "genero_id": genero_id,
                "edicion": edicion,
                "anio_publicacion": anio_publicacion,
            }
        )

    async def existe_libro_duplicado(
        self,
        nombre: str,
        autor_id: PydanticObjectId,
        editorial_id: PydanticObjectId,
        genero_id: PydanticObjectId,
        edicion: str | None,
        anio_publicacion: int,
        excluir_id: PydanticObjectId | None = None,
    ) -> bool:
        query: dict = {
            "nombre": {"$regex": f"^{re.escape(nombre)}$", "$options": "i"},
            "autor_id": autor_id,
            "editorial_id": editorial_id,
            "genero_id": genero_id,
            "edicion": edicion,
            "anio_publicacion": anio_publicacion,
        }

        if excluir_id:
            query["_id"] = {"$ne": excluir_id}

        return await self.model.find(query).count() > 0

    async def isbn_existe(
        self,
        isbn: str,
        excluir_id: PydanticObjectId | None = None,
    ) -> bool:
        query: dict = {"isbn": isbn}
        if excluir_id:
            query["_id"] = {"$ne": excluir_id}
        return await self.model.find(query).count() > 0

    async def sku_existe(
        self,
        sku: str,
        excluir_id: PydanticObjectId | None = None,
    ) -> bool:
        query: dict = {"sku": sku}
        if excluir_id:
            query["_id"] = {"$ne": excluir_id}
        return await self.model.find(query).count() > 0

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        autor_id: PydanticObjectId | None = None,
        editorial_id: PydanticObjectId | None = None,
        genero_id: PydanticObjectId | None = None,
        idioma: Idiomas | None = None,
        anio_desde: int | None = None,
        anio_hasta: int | None = None,
        precio_min: Decimal | None = None,
        precio_max: Decimal | None = None,
        solo_activos: bool = True,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Libro], int]:
        limit = min(limit, MAX_LIMIT)
        query: dict = {}

        if solo_activos:
            query["activo"] = True

        if nombre:
            query["nombre"] = {"$regex": re.escape(nombre), "$options": "i"}

        if autor_id:
            query["autor_id"] = autor_id
        if editorial_id:
            query["editorial_id"] = editorial_id
        if genero_id:
            query["genero_id"] = genero_id

        if idioma:
            query["idioma"] = idioma

        if anio_desde is not None or anio_hasta is not None:
            rango_anio: dict = {}
            if anio_desde is not None:
                rango_anio["$gte"] = anio_desde
            if anio_hasta is not None:
                rango_anio["$lte"] = anio_hasta
            query["anio_publicacion"] = rango_anio

        if precio_min is not None or precio_max is not None:
            rango_precio: dict = {}
            if precio_min is not None:
                rango_precio["$gte"] = precio_min
            if precio_max is not None:
                rango_precio["$lte"] = precio_max
            query["precio"] = rango_precio

        total = await self.model.find(query).count()

        libros = (
            await self.model.find(query)
            .sort(-self.model.fecha_creacion)
            .skip(skip)
            .limit(limit)
            .to_list()
        )

        return libros, total