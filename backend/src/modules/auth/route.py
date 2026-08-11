from fastapi import APIRouter, Request, Response
from src.core.rate_limit import auth_limit
from src.modules.auth.controller import AuthController
from src.modules.auth.schema import LoginRequest, RefreshRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])
controller = AuthController()

@router.post("/login", response_model=TokenResponse)
@auth_limit("5/minute")
async def login(request: Request, data: LoginRequest, response: Response):
    return await controller.login(data)


@router.post("/refresh", response_model=TokenResponse)
@auth_limit("10/minute")
async def refresh(request: Request, data: RefreshRequest, response: Response):
    return await controller.refrescar(data)