from beanie import PydanticObjectId
from src.core.exceptions import ForbiddenException, UnauthorizedException
from src.core.security.jwt import crear_access_token, crear_refresh_token, decodificar
from src.modules.auth.schema import LoginRequest, RefreshRequest, TokenResponse
from src.modules.usuarios.document import Usuario
from src.modules.usuarios.service import verificar_password


class AuthService:
    async def login(self, data: LoginRequest) -> TokenResponse:
        usuario = await Usuario.find_one(Usuario.correo == data.correo)

        if not usuario:
            raise UnauthorizedException("Credenciales incorrectas")

        if not usuario.activo:
            raise ForbiddenException("Cuenta desactivada, comunícate con un administrador")

        if not verificar_password(data.password, usuario.password):
            raise UnauthorizedException("Credenciales incorrectas")

        access = crear_access_token({"sub": str(usuario.id)})
        refresh = crear_refresh_token({"sub": str(usuario.id)})
        return TokenResponse(access_token=access, refresh_token=refresh)

    async def refrescar(self, data: RefreshRequest) -> TokenResponse:
        payload = decodificar(data.refresh_token)

        if payload is None:
            raise UnauthorizedException("Refresh token inválido o expirado")

        if payload.get("type") != "refresh":
            raise UnauthorizedException("Se requiere un refresh token válido")

        try:
            usuario_id = PydanticObjectId(payload["sub"])
        except Exception:
            raise UnauthorizedException("Token inválido")

        usuario = await Usuario.get(usuario_id)

        if not usuario or not usuario.activo:
            raise UnauthorizedException("Usuario no válido")

        nuevo_access = crear_access_token({"sub": str(usuario.id)})
        nuevo_refresh = crear_refresh_token({"sub": str(usuario.id)})
        return TokenResponse(access_token=nuevo_access, refresh_token=nuevo_refresh)

    async def logout(self) -> dict:
        return {"mensaje": "Sesión cerrada correctamente"}