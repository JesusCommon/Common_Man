from app.models.usuarios_model import Usuario
from app.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate
from app.repos.base_repo import BaseRepoConEstado
from beanie import PydanticObjectId


class UsuarioRepo(BaseRepoConEstado[Usuario, UsuarioCreate, UsuarioUpdate]):
    def __init__(self):
        super().__init__(Usuario)

    async def obtener_por_correo(self, correo: str) -> Usuario | None:
        return await Usuario.find_one(Usuario.correo == correo)

    async def obtener_por_username(self, username: str) -> Usuario | None:
        return await Usuario.find_one(Usuario.username == username)

    async def obtener_por_telefono(self, telefono: str) -> Usuario | None:
        return await Usuario.find_one(Usuario.telefono == telefono)

    async def listar_inactivos(self) -> list[Usuario]:
        return await Usuario.find(Usuario.activo == False).to_list()

    async def actualizar_password(self, id: PydanticObjectId, password_hasheada: str) -> Usuario | None:
        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        documento.password = password_hasheada
        await documento.save()
        return documento

    async def recargar_saldo(self, id: PydanticObjectId, monto: float) -> Usuario | None:
        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        documento.saldo += monto
        await documento.save()
        return documento