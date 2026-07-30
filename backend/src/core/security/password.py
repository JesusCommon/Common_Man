import bcrypt
from fastapi import HTTPException, status

BCRYPT_MAX_BYTES = 72

def hashear_password(password: str) -> str:
    if len(password.encode("utf-8")) > BCRYPT_MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La contraseña no puede exceder {BCRYPT_MAX_BYTES} bytes"
        )
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verificar_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))