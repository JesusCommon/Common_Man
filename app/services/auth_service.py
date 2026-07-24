from fastapi import HTTPException, status
from app.repos.usuarios_repo import UsuarioRepo
from app.schemas.auth_schema import LoginRequest, TokenResponse, RefreshRequest
from app.services.usuarios_service import verificar_password
from app.core.security import crear_access_token, crear_refresh_token, decodificar
from app.models.usuarios_model import Usuario
from beanie import PydanticObjectId


class AuthService:
    def __init__(self):
        self.repo = UsuarioRepo()

    async def login(self, data: LoginRequest) -> TokenResponse:
        usuario = await self.repo.obtener_por_correo(data.correo)

        if not usuario:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales incorrectas")

        if not usuario.activo:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Cuenta desactivada comunicar con un administrador")

        if not verificar_password(data.password, usuario.password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales incorrectas")

        access = crear_access_token({"sub": str(usuario.id)})
        refresh = crear_refresh_token({"sub": str(usuario.id)})
        return TokenResponse(access_token=access, refresh_token=refresh)

    async def refrescar(self, data: RefreshRequest) -> TokenResponse:
        payload = decodificar(data.refresh_token)

        if payload is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token inválido o expirado")

        if payload.get("type") != "refresh":
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Se requiere un refresh token válido")

        try:
            usuario_id = PydanticObjectId(payload["sub"])
        except Exception:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")

        usuario = await Usuario.get(usuario_id)
        if not usuario or not usuario.activo:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario no válido")

        nuevo_access = crear_access_token({"sub": str(usuario.id)})
        nuevo_refresh = crear_refresh_token({"sub": str(usuario.id)})
        return TokenResponse(access_token=nuevo_access, refresh_token=nuevo_refresh)