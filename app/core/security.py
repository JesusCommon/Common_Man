from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from beanie import PydanticObjectId
from app.settings.settings import get_settings
from app.models.usuarios_model import Usuario
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security_scheme = HTTPBearer()


settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def crear_access_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(UTC) + timedelta(minutes=settings.jwt.expire_minutes)
    to_encode.update({"exp": expira})
    return jwt.encode(to_encode, settings.jwt.secret_key, algorithm=settings.jwt.algorithm)


def decodificar(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.jwt.secret_key, algorithms=[settings.jwt.algorithm])
    except JWTError:
        return None

async def obtener_usuario_actual(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme)
) -> Usuario:
    token = credentials.credentials  # 👈 aquí sacas el token puro

    payload = decodificar(token)
    if payload is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido o expirado")

    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")

    try:
        usuario_id = PydanticObjectId(sub)
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")

    usuario = await Usuario.get(usuario_id)
    if usuario is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario no encontrado")

    if not usuario.activo:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cuenta desactivada")

    return usuario