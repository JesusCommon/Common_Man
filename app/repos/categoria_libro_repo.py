from app.models.categoria_libro_model import CategoriaLibro
from app.schemas.categoria_libro_schema import CategoriaCreate, CategoriaUpdate
from app.repos.base_repo import BaseRepoConEstado


class CategoriaRepo(BaseRepoConEstado[CategoriaLibro, CategoriaCreate, CategoriaUpdate]):
    def __init__(self):
        super().__init__(CategoriaLibro)

    async def obtener_por_nombre(self, nombre: str) -> CategoriaLibro | None:
        return await CategoriaLibro.find_one(CategoriaLibro.nombre == nombre)