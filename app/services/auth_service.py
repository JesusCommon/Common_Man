from fastapi import HTTPException, status
from app.repos.usuarios_repo import UsuarioRepo
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.services.usuarios_service import verificar_password
from app.core.security import crear_access_token

class AuthService:
    def __init__(self):
        self.repo = UsuarioRepo()

    async def login(self, data: LoginRequest) -> TokenResponse:
        usuario = await self.repo.obtener_por_correo(data.correo)

        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        if not usuario.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cuenta desactivada comunicar con un administrador"
            )
        
        if not verificar_password(data.password, usuario.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        token = crear_access_token({"sub":str(usuario.id)})
        return TokenResponse(access_token=token)
    