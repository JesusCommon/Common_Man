from datetime import datetime, timedelta, UTC
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from beanie import PydanticObjectId
from app.settings.settings import get_settings
from app.models.usuarios_model import Usuario

settings = get_settings()

bearer_scheme = HTTPBearer()

def crear_access_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(UTC) + timedelta(minutes=settings.jwt.expire_minutes)
    to_encode.update({"exp": expira, "type": "access"})
    return jwt.encode(to_encode, settings.jwt.secret_key, algorithm=settings.jwt.algorithm)

def crear_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(UTC) + timedelta(days=settings.jwt.refresh_expire_days)
    to_encode.update({"exp": expira, "type": "refresh"})
    return jwt.encode(to_encode, settings.jwt.secret_key, algorithm=settings.jwt.algorithm)

def decodificar(token: str) -> dict | None:
    try:
        return jwt.decode(
            token,
            settings.jwt.secret_key,
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Se requiere un access token",
        )

    try:
        usuario_id = PydanticObjectId(payload["sub"])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )

    usuario = await Usuario.get(usuario_id)

    if usuario is None or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no válido",
        )

    return usuario
