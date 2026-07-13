from app.models.categoria_libro_model import Categoria
from app.schemas.categoria_libro_schema import CategoriaCreate, CategoriaUpdate
from app.repos.base_repo import BaseRepoConEstado


class CategoriaRepo(BaseRepoConEstado[Categoria, CategoriaCreate, CategoriaUpdate]):
    def __init__(self):
        super().__init__(Categoria)

    async def obtener_por_nombre(self, nombre: str) -> Categoria | None:
        return await Categoria.find_one(Categoria.nombre == nombre)