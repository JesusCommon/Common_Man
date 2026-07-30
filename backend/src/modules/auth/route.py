from fastapi import APIRouter
from src.modules.auth.controller import AuthController
from src.modules.auth.schema import LoginRequest, RefreshRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])
controller = AuthController()

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    return await controller.login(data)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest):
    return await controller.refrescar(data)