from src.modules.categorias_libro.document import CategoriaLibro
from src.modules.categorias_libro.schema import CategoriaLibroCreate, CategoriaLibroUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

class CategoriaLibroRepo(BaseRepoConEstado[CategoriaLibro, CategoriaLibroCreate, CategoriaLibroUpdate]):
    def __init__(self):
        super().__init__(CategoriaLibro)

    async def obtener_por_nombre(self, nombre : str) -> CategoriaLibro | None:
        return await CategoriaLibro.find_one(CategoriaLibro.nombre == nombre)
    