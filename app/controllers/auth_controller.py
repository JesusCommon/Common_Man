from app.schemas.auth_schema import LoginRequest, TokenResponse, RefreshRequest
from app.services.auth_service import AuthService

class AuthController:
    def __init__(self):
        self.service = AuthService()

    async def login(self, data: LoginRequest) -> TokenResponse:
        return await self.service.login(data)

    async def refrescar(self, data: RefreshRequest) -> TokenResponse:
        return await self.service.refrescar(data)