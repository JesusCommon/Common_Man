from uuid import UUID
import bcrypt
from fastapi import HTTPException, status
from src.core.security.jwt import crear_access_token, crear_refresh_token, decodificar
from src.core.security.password import verificar_password
from src.modules.usuarios.document import Usuario
from src.modules.usuarios.repo import UsuarioRepo
from src.modules.auth.schema import LoginRequest, TokenResponse

_DUMMY_HASH = bcrypt.hashpw("password_senuelo_para_timing".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

class AuthService:
    def __init__(self):
        self.repo = UsuarioRepo()

    async def _buscar_por_identidad(self, identidad: str) -> Usuario | None:
        if "@" in identidad:
            return await self.repo.obtener_por_correo(identidad)
        return await self.repo.obtener_por_username(identidad)

    def _generar_tokens(self, usuario: Usuario) -> TokenResponse:
        payload = {"sub": str(usuario.identificador)}
        access = crear_access_token(payload)
        refresh = crear_refresh_token(payload)
        return TokenResponse(access_token=access, refresh_token=refresh)

    async def login(self, data: LoginRequest) -> TokenResponse:
        usuario = await self._buscar_por_identidad(data.identidad)

        hash_a_verificar = usuario.password if usuario else _DUMMY_HASH
        password_valida = verificar_password(data.password, hash_a_verificar)

        if usuario is None or not password_valida:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas"
            )

        if not usuario.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta cuenta está desactivada"
            )

        return self._generar_tokens(usuario)

    async def refrescar(self, refresh_token: str) -> TokenResponse:
        payload = decodificar(refresh_token)

        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token inválido o expirado"
            )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Se requiere un refresh token"
            )

        try:
            identificador = UUID(payload["sub"])
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )

        usuario = await self.repo.obtener_por_identificador(identificador)

        if usuario is None or not usuario.activo:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no válido"
            )

        return self._generar_tokens(usuario)