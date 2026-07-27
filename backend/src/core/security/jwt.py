from datetime import UTC, datetime, timedelta
from beanie import PydanticObjectId
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from src.core.exceptions import ForbiddenException, UnauthorizedException
from src.core.settings.settings import get_settings
from src.modules.usuarios.document import Usuario, RolUsuario

settings = get_settings()
bearer_scheme = HTTPBearer()


def crear_access_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(UTC) + timedelta(minutes=settings.jwt.expire_minutes)
    to_encode.update({"exp": expira, "type": "access"})
    return jwt.encode(
        to_encode,
        settings.jwt.secret_key.get_secret_value(),
        algorithm=settings.jwt.algorithm,
    )


def crear_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(UTC) + timedelta(days=settings.jwt.refresh_expire_days)
    to_encode.update({"exp": expira, "type": "refresh"})
    return jwt.encode(
        to_encode,
        settings.jwt.secret_key.get_secret_value(),
        algorithm=settings.jwt.algorithm,
    )


def decodificar(token: str) -> dict | None:
    try:
        return jwt.decode(
            token,
            settings.jwt.secret_key.get_secret_value(),
            algorithms=[settings.jwt.algorithm],
        )
    except JWTError:
        return None


async def obtener_usuario_actual(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Usuario:
    token = credentials.credentials
    payload = decodificar(token)

    if payload is None:
        raise UnauthorizedException("Token inválido o expirado")

    if payload.get("type") != "access":
        raise UnauthorizedException("Se requiere un access token")

    try:
        usuario_id = PydanticObjectId(payload["sub"])
    except Exception:
        raise UnauthorizedException("Token inválido")

    usuario = await Usuario.get(usuario_id)

    if usuario is None or not usuario.activo:
        raise UnauthorizedException("Usuario no válido")

    return usuario


async def obtener_usuario_admin(
    usuario_actual: Usuario = Depends(obtener_usuario_actual),
) -> Usuario:
    if usuario_actual.rol != RolUsuario.ADMIN:
        raise ForbiddenException("Requiere permisos de administrador")
    return usuario_actual