from app.models.libros_model import Libro
from app.schemas.libros_schema import LibroCreate, LibroUpdate
from app.repos.base_repo import BaseRepoConEstado
from beanie import PydanticObjectId

class LibroRepo(BaseRepoConEstado[Libro, LibroCreate, LibroUpdate]):
    def __init__(self):
        super().__init__(Libro)

    async def obtener_por_nombre(self, nombre : str) -> Libro | None:
        return await Libro.find_one(Libro.nombre == nombre)
    
    async def buscar_con_filtro(
        self,
        nombre: str | None = None,
        categoria_id: PydanticObjectId | None = None,
        precio_min: float | None = None,
        precio_max: float | None = None,
        idioma: str | None = None,
        anio_publicacion: int | None = None,
        autor: str | None = None,
        editorial: str | None = None,
        ordenar_por: str = "fecha_creacion",
        orden_desc: bool = True,
        skip: int = 0,
        limit: int = 20
    ) -> list[Libro]:
        query = {}

        if nombre:
            query["nombre"] = {"$regex": nombre, "$options": "i"}
        if categoria_id:
            query["categoria.$id"] = categoria_id
        if precio_min is not None or precio_max is not None:
            query["precio"] = {}
            if precio_min is not None:
                query["precio"]["$gte"] = precio_min
            if precio_max is not None:
                query["precio"]["$lte"] = precio_max
        if idioma:
            query["idioma"] = idioma
        if anio_publicacion is not None:
            query["anio_publicacion"] = anio_publicacion
        if autor:
            query["autor"] = {"$regex": autor, "$options": "i"}
        if editorial:
            query["editorial"] = {"$regex": editorial, "$options": "i"}

        campo_orden = f"-{ordenar_por}" if orden_desc else ordenar_por

        return (
            await Libro.find(query)
            .sort(campo_orden)
            .skip(skip)
            .limit(limit)
            .to_list()
        )
