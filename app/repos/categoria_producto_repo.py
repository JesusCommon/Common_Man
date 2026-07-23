from app.models.categoria_producto_model import CategoriaProducto
from app.schemas.categoria_producto_schema import CategoriaCreate, CategoriaUpdate
from app.repos.base_repo import BaseRepoConEstado


class CategoriaRepo(BaseRepoConEstado[CategoriaProducto, CategoriaCreate, CategoriaUpdate]):
    def __init__(self):
        super().__init__(CategoriaProducto)

    async def obtener_por_nombre(self, nombre: str) -> CategoriaProducto | None:
        return await CategoriaProducto.find_one(CategoriaProducto.nombre == nombre)