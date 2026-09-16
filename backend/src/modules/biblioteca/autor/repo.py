from src.modules.biblioteca.autor.document import Autor
from src.modules.biblioteca.autor.schema import AutorCreate, AutorUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado

class AutorRepo(BaseRepoConEstado[Autor, AutorCreate, AutorUpdate]):
    def __init__(self):
        super().__init__(Autor)

    async def obtener_por_nombre_apellido(
        self,
        nombre: str,
        apellido: str,
    ) -> Autor | None:
        return await self.model.find_one(
            {
                "nombre": nombre,
                "apellido": apellido,
            }
        )

    async def obtener_por_pais_nacimiento(self, pais_nacimiento: str) -> Autor | None:
        return await self.model.find_one(self.model.pais_nacimiento == pais_nacimiento)