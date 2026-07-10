from app.models.categorias_libros_model import Categorias
from app.schemas.categorias_libros_schema import CategoriaCreate, CategoriaUpdate
from app.repos.base_repo import BaseRepoConEstado


class CategoriaRepo(BaseRepoConEstado[Categorias, CategoriaCreate, CategoriaUpdate]):
    def __init__(self):
        super().__init__(Categorias)

    async def obtener_por_nombre(self, nombre: str) -> Categorias | None:
        return await Categorias.find_one(Categorias.nombre == nombre)