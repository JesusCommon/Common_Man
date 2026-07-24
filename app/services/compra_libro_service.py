from fastapi import HTTPException, status
from app.repos.compra_libro_repo import CompraLibroRepo
from app.models.libros_model import Libro
from app.models.usuarios_model import Usuario
from app.models.compra_libro_model import CompraLibro
from beanie import PydanticObjectId
from beanie.odm.operators.update.general import Inc

class CompraLibroService:
    def __init__(self):
        self.repo = CompraLibroRepo()

    async def comprar(self, usuario_id: PydanticObjectId, libro_id: PydanticObjectId) -> CompraLibro:
        libro = await Libro.get(libro_id)
        if not libro:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe un libro con el ID '{libro_id}'"
            )

        if not libro.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Este libro no está disponible para la compra"
            )

        if await self.repo.existe_compra(usuario_id, libro_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya has comprado este libro anteriormente"
            )

        usuario = await Usuario.get(usuario_id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )

        if usuario.saldo < libro.precio:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Saldo insuficiente. Necesitas {libro.precio} y tienes {usuario.saldo}"
            )

        compra = await self.repo.crear(usuario_id, libro_id, libro.precio)

        await Usuario.find_one(Usuario.id == usuario_id).update(Inc({Usuario.saldo: -libro.precio}))
        await Libro.find_one(Libro.id == libro_id).update(Inc({Libro.descargas: 1}))

        return compra

    async def listar_por_usuario(self, usuario_id: PydanticObjectId) -> list[CompraLibro]:
        return await self.repo.listar_por_usuario(usuario_id)