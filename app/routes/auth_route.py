from fastapi import APIRouter
from app.schemas.auth_schema import LoginRequest, TokenResponse, RefreshRequest
from app.controllers.auth_controller import AuthController

router = APIRouter(prefix="/auth", tags=["Auth"])
controller = AuthController()

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    return await controller.login(data)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest):
    return await controller.refrescar(data)

@router.post("/logout")
async def logout():
    return {"mensaje": "Sesión cerrada correctamente"}