from beanie import PydanticObjectId
from app.schemas.usuarios_schema import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse,
    UsuarioCambiarPassword,
    UsuarioRecargarSaldo,
)
from app.services.usuarios_service import UsuarioService
from uuid import UUID

class UsuarioController:
    def __init__(self):
        self.service = UsuarioService()

    async def crear(self, data: UsuarioCreate) -> UsuarioResponse:
        usuario = await self.service.crear(data)
        return UsuarioResponse.model_validate(usuario)

    async def obtener_id(self, id: PydanticObjectId) -> UsuarioResponse:
        usuario = await self.service.obtener_por_id(id)
        return UsuarioResponse.model_validate(usuario)

    async def actualizar(self, id: PydanticObjectId, data: UsuarioUpdate) -> UsuarioResponse:
        usuario = await self.service.actualizar(id, data)
        return UsuarioResponse.model_validate(usuario)

    async def listar(self) -> list[UsuarioResponse]:
        usuarios = await self.service.listar()
        return [UsuarioResponse.model_validate(u) for u in usuarios]

    async def listar_inactivos(self) -> list[UsuarioResponse]:
        usuarios = await self.service.listar_inactivos()
        return [UsuarioResponse.model_validate(u) for u in usuarios]

    async def listar_activos(self) -> list[UsuarioResponse]:
        usuarios = await self.service.listar_activos()
        return [UsuarioResponse.model_validate(u) for u in usuarios]

    async def activar(self, id: PydanticObjectId) -> UsuarioResponse:
        usuario = await self.service.activar(id)
        return UsuarioResponse.model_validate(usuario)

    async def desactivar(self, id: PydanticObjectId) -> UsuarioResponse:
        usuario = await self.service.desactivar(id)
        return UsuarioResponse.model_validate(usuario)

    async def cambiar_password(self, id: PydanticObjectId, data: UsuarioCambiarPassword) -> UsuarioResponse:
        usuario = await self.service.cambiar_password(id, data)
        return UsuarioResponse.model_validate(usuario)

    async def recargar_saldo(self, id: PydanticObjectId, data: UsuarioRecargarSaldo) -> UsuarioResponse:
        usuario = await self.service.recargar_saldo(id, data)
        return UsuarioResponse.model_validate(usuario)

    async def obtener_por_identificador(self, identificador: UUID) -> UsuarioResponse:
        usuario = await self.service.obtener_por_identificador(identificador)
        return UsuarioResponse.model_validate(usuario)

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        apellido: str | None = None,
        username: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[UsuarioResponse]:
        usuarios = await self.service.buscar_por_filtro(
            nombre=nombre,
            apellido=apellido,
            username=username,
            skip=skip,
            limit=limit,
        )
        return [UsuarioResponse.model_validate(u) for u in usuarios]