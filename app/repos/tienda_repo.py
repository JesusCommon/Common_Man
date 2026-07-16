from app.models.tienda_model import ProductoTienda
from app.schemas.tienda_schema import TiendaCreate, TiendaUpdate
from app.repos.base_repo import BaseRepoConEstado

class TiendaRepo(BaseRepoConEstado[ProductoTienda, TiendaCreate, TiendaUpdate]):
    def __init__(self):
        super().__init__(ProductoTienda)

    async def obtener_por_nombre(self, nombre : str) -> ProductoTienda | None:
        return await ProductoTienda.find_one(ProductoTienda.nombre == nombre)
    
    async def obtener_por_codigo(self, codigo : str) -> ProductoTienda | None:
        return await ProductoTienda.find_one(ProductoTienda.codigo == codigo)
