from app.models.libros_model import Libro
from app.schemas.libros_schema import LibroCreate, LibroUpdate
from app.repos.base_repo import BaseRepoConEstado

class LibroRepo(BaseRepoConEstado[Libro, LibroCreate, LibroUpdate]):
    def __init__(self):
        super().__init__(Libro)

    async def obtener_por_nombre(self, nombre : str) -> Libro | None:
        return await Libro.find_one(Libro.nombre == nombre)
