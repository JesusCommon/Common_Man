from beanie import PydanticObjectId
from app.schemas.usuarios_schema import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse,
    UsuarioCambiarPassword,
    UsuarioRecargarSaldo,
)
from app.services.usuarios_service import UsuarioService


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