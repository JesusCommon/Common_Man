from src.modules.biblioteca.genero.document import Genero
from src.modules.biblioteca.genero.schema import GeneroCreate, GeneroUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

class GeneroRepo(BaseRepoConEstado[Genero, GeneroCreate, GeneroUpdate]):
    def __init__(self):
        super().__init__(Genero)

    async def obtener_por_nombre(self, nombre: str) -> Genero | None:
        return await self.model.find_one(self.model.nombre == nombre)