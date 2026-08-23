from src.modules.categoriasProductos.document import Categorias
from src.modules.categoriasProductos.schema import CategoriaCreate, CategoriaUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

class CategoriaRepo(BaseRepoConEstado[Categorias, CategoriaCreate, CategoriaUpdate]):
    def __init__(self):
        super().__init__(Categorias)

    async def obtener_por_nombre(self, nombre: str) -> Categorias | None:
        return await self.model.find_one(self.model.nombre == nombre)