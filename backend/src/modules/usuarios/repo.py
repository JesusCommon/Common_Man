import re
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.usuarios.schema import UsuarioCreate, UsuarioUpdate
from src.shared.repositories.BaseRepo import BaseRepoConEstado
from beanie import PydanticObjectId
from uuid import UUID

MAX_LIMIT = 100


class UsuarioRepo(BaseRepoConEstado[Usuario, UsuarioCreate, UsuarioUpdate]):
    def __init__(self):
        super().__init__(Usuario)

    async def obtener_por_correo(self, correo: str) -> Usuario | None:
        return await Usuario.find_one(Usuario.correo == correo)

    async def obtener_por_username(self, username: str) -> Usuario | None:
        return await Usuario.find_one(Usuario.username == username)

    async def obtener_por_identificador(self, identificador: UUID) -> Usuario | None:
        return await Usuario.find_one(Usuario.identificador == identificador)

    async def obtener_por_telefono(self, telefono: str) -> Usuario | None:
        return await Usuario.find_one(Usuario.telefono == telefono)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> list[Usuario]:
        limit = min(limit, MAX_LIMIT)
        return await Usuario.find(Usuario.activo == False).skip(skip).limit(limit).to_list()

    async def actualizar_password(
        self, identificador: UUID, password_hasheada: str
    ) -> Usuario | None:
        documento = await self.obtener_por_identificador(identificador)
        if not documento:
            return None

        documento.password = password_hasheada
        await documento.save()
        return documento

    async def recargar_saldo(
        self, identificador: UUID, monto: int
    ) -> Usuario | None:

        resultado = await Usuario.find_one(
            Usuario.identificador == identificador
        ).update({"$inc": {Usuario.saldo: monto}})

        if resultado.modified_count == 0:
            return None

        return await self.obtener_por_identificador(identificador)

    async def actualizar_password_admin(
        self, id: PydanticObjectId, password_hasheada: str
    ) -> Usuario | None:
        documento = await self.obtener_por_id(id)
        if not documento:
            return None

        documento.password = password_hasheada
        await documento.save()
        return documento

    async def recargar_saldo_admin(
        self, id: PydanticObjectId, monto: int
    ) -> Usuario | None:
        resultado = await Usuario.find_one(Usuario.id == id).update(
            {"$inc": {Usuario.saldo: monto}}
        )

        if resultado.modified_count == 0:
            return None

        return await self.obtener_por_id(id)

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        apellido: str | None = None,
        username: str | None = None,
        skip: int = 0,
        limit: int = 20,
        excluir_rol: RolUsuario | None = None,
        solo_activos: bool = False,
    ) -> list[Usuario]:
        limit = min(limit, MAX_LIMIT)
        query = {}

        if nombre:
            query["nombre"] = {"$regex": re.escape(nombre), "$options": "i"}
        if apellido:
            query["apellido"] = {"$regex": re.escape(apellido), "$options": "i"}
        if username:
            query["username"] = {"$regex": re.escape(username), "$options": "i"}
        if excluir_rol:
            query["rol"] = {"$ne": excluir_rol}
        if solo_activos:
            query["activo"] = True

        return await Usuario.find(query).skip(skip).limit(limit).to_list()