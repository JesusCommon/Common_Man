from app.models.usuarios_model import Usuario
from app.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate
from app.repos.base_repo import BaseRepoConEstado
from beanie import PydanticObjectId
from uuid import UUID


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
    
    async def buscar_por_filtro(
        self,
        nombre : str | None = None,
        apellido : str | None = None,
        username : str | None = None,
        skip : int = 0,
        limit : int = 20,
    ) -> list[Usuario]: 
        query = {}
    
        if nombre: 
            query["nombre"] = {"$regex": nombre, "$options": "i"}
        if apellido: 
            query["apellido"] = {"$regex": apellido, "$options": "i"}
        if username: 
            query["username"] = {"$regex": username, "$options": "i"}
        
        return (
            await Usuario.find(query)
            .skip(skip)
            .limit(limit)
            .to_list()
        )