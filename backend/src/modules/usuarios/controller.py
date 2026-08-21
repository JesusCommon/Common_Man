from uuid import UUID
from beanie import PydanticObjectId
from src.modules.usuarios.document import Usuario
from src.modules.usuarios.schema import (
    UsuarioAdminUpdate,
    UsuarioCambiarPassword,
    UsuarioCreate,
    UsuarioRecargarSaldo,
    UsuarioUpdate,
)
from src.modules.usuarios.service import UsuarioService

class UsuarioController:
    def __init__(self):
        self.service = UsuarioService()

    async def crear(self, data: UsuarioCreate) -> Usuario:
        return await self.service.crear(data)

    async def obtener_por_identificador(self, identificador: UUID) -> Usuario:
        return await self.service.obtener_por_identificador(identificador)

    async def actualizar(self, identificador: UUID, data: UsuarioUpdate) -> Usuario:
        return await self.service.actualizar(identificador, data)

    async def cambiar_password(
        self, identificador: UUID, data: UsuarioCambiarPassword
    ) -> Usuario:
        return await self.service.cambiar_password(identificador, data)

    async def recargar_saldo(
        self, identificador: UUID, data: UsuarioRecargarSaldo
    ) -> Usuario:
        return await self.service.recargar_saldo(identificador, data)

    async def buscar_personas(
        self,
        nombre: str | None = None,
        apellido: str | None = None,
        username: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Usuario]:
        return await self.service.buscar_personas(
            nombre=nombre,
            apellido=apellido,
            username=username,
            skip=skip,
            limit=limit,
        )
    
    async def obtener_perfil_publico(self, username: str) -> Usuario:
        return await self.service.obtener_perfil_publico(username)

#-------------- exclusivo admin --------------------#

    async def actualizar_admin(
        self, id: PydanticObjectId, data: UsuarioAdminUpdate) -> Usuario:
        return await self.service.actualizar_admin(id, data)

    async def recargar_saldo_admin(
        self, identificador: PydanticObjectId | UUID, data: UsuarioRecargarSaldo) -> Usuario:
        return await self.service.recargar_saldo_admin(identificador, data)

    async def restar_saldo_admin(
        self, identificador: PydanticObjectId | UUID, data: UsuarioRecargarSaldo) -> Usuario:
        return await self.service.restar_saldo_admin(identificador, data)

    async def activar(self, id: PydanticObjectId) -> Usuario:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Usuario:
        return await self.service.desactivar(id)

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        apellido: str | None = None,
        username: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Usuario]:
        return await self.service.buscar_por_filtro(
            nombre=nombre,
            apellido=apellido,
            username=username,
            skip=skip,
            limit=limit,
        )
    
    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        return await self.service.listar(skip=skip, limit=limit)
    
    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        return await self.service.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        return await self.service.listar_inactivos(skip=skip, limit=limit)

    async def obtener_id(self, id: PydanticObjectId) -> Usuario:
        return await self.service.obtener_por_id(id)
