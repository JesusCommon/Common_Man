from uuid import UUID

from beanie import PydanticObjectId

from src.modules.usuarios.document import Usuario
from src.modules.usuarios.schema import (
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

    async def listar(self) -> list[Usuario]:
        return await self.service.listar()

    async def listar_activos(self) -> list[Usuario]:
        return await self.service.listar_activos()

    async def listar_inactivos(self) -> list[Usuario]:
        return await self.service.listar_inactivos()

    async def obtener_id(self, id: PydanticObjectId) -> Usuario:
        return await self.service.obtener_por_id(id)

    async def obtener_por_identificador(self, identificador: UUID) -> Usuario:
        return await self.service.obtener_por_identificador(identificador)

    async def actualizar(self, id: PydanticObjectId, data: UsuarioUpdate) -> Usuario:
        return await self.service.actualizar(id, data)

    async def cambiar_password(self, id: PydanticObjectId, data: UsuarioCambiarPassword) -> Usuario:
        return await self.service.cambiar_password(id, data)

    async def recargar_saldo(self, id: PydanticObjectId, data: UsuarioRecargarSaldo) -> Usuario:
        return await self.service.recargar_saldo(id, data)

    async def activar(self, id: PydanticObjectId) -> Usuario:
        return await self.service.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Usuario:
        return await self.service.desactivar(id)

    # --- Búsqueda social: cualquier usuario autenticado, sin admins ---
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

    # --- Búsqueda administrativa: solo admin, sin restricciones ---
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