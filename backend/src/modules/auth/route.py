from fastapi import APIRouter, Depends
from src.core.security.jwt import obtener_usuario_actual
from src.modules.auth.controller import AuthController
from src.modules.auth.schema import LoginRequest, RefreshRequest, TokenResponse
from src.modules.usuarios.document import Usuario

router = APIRouter(prefix="/auth", tags=["Auth"])
controller = AuthController()

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    return await controller.login(data)

@router.post("/refresh", response_model=TokenResponse)
async def refrescar(data: RefreshRequest):
    return await controller.refrescar(data)

@router.post("/logout")
async def logout(usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    return await controller.service.logout()