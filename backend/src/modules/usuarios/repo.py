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
        return await self.model.find_one(self.model.correo == correo)

    async def obtener_por_username(self, username: str) -> Usuario | None:
        return await self.model.find_one(self.model.username == username)

    async def obtener_por_identificador(self, identificador: UUID) -> Usuario | None:
        return await self.model.find_one(self.model.identificador == identificador)

    async def obtener_por_telefono(self, telefono: str) -> Usuario | None:
        return await self.model.find_one(self.model.telefono == telefono)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        query = self.model.find(self.model.activo == True)
        total = await query.count()
        usuarios = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return usuarios, total

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        query = self.model.find(self.model.activo == False)
        total = await query.count()
        usuarios = await query.sort(-self.model.id).skip(skip).limit(limit).to_list()
        return usuarios, total

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

        resultado = await self.model.find_one(
            self.model.identificador == identificador
        ).update({"$inc": {self.model.saldo: monto}})

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

    async def recargar_saldo_admin(self, filtro: dict, monto: int) -> Usuario:
        await self.model.find_one(filtro).update({"$inc": {self.model.saldo: monto}})
        return await self.model.find_one(filtro)
    
    async def restar_saldo_admin(self, filtro: dict, monto: int) -> Usuario | None:
        filtro_con_saldo = {**filtro, self.model.saldo: {"$gte": monto}}
        resultado = await self.model.find_one(filtro_con_saldo).update(
            {"$inc": {self.model.saldo: -monto}}
        )
        if resultado.modified_count == 0:
            return None
        return await self.model.find_one(filtro)


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

        return await self.model.find(query).skip(skip).limit(limit).to_list()