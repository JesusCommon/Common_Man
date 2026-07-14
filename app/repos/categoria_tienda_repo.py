from app.models.categoria_tienda_model import CategoriaTienda
from app.schemas.categoria_tienda_schema import CategoriaCreate, CategoriaUpdate
from app.repos.base_repo import BaseRepoConEstado


class CategoriaRepo(BaseRepoConEstado[CategoriaTienda, CategoriaCreate, CategoriaUpdate]):
    def __init__(self):
        super().__init__(CategoriaTienda)

    async def obtener_por_nombre(self, nombre: str) -> CategoriaTienda | None:
        return await CategoriaTienda.find_one(CategoriaTienda.nombre == nombre)