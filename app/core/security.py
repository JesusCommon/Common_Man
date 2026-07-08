from datetime import datetime, timedelta, UTC
from jose import jwt, JWTError
from app.settings.settings import get_settings

settings = get_settings()

def crear_access_token(data: dict) -> str:
    to_encode = data.copy()
    expira = datetime.now(UTC) + timedelta(minutes=settings.jwt.expire_minutes)
    to_encode.update({"exp":expira})
    return jwt.encode(to_encode, settings.jwt.secret_key, algorithm=settings.jwt.algorithm)

def decodificar(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.jwt.secret_key, algorithms=[settings.jwt.algorithm])
    except JWTError:
        return None