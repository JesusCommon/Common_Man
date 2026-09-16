from src.modules.biblioteca.editorial.document import Editorial
from src.modules.biblioteca.editorial.schema import EditorialCreate, EditorialUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

class EditorialRepo(BaseRepoConEstado[Editorial, EditorialCreate, EditorialUpdate]):
    def __init__(self):
        super().__init__(Editorial)

    async def obtener_por_nombre(self, nombre: str) -> Editorial | None:
        return await self.model.find_one(self.model.nombre == nombre)