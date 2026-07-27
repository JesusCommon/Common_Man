from src.modules.auth.schema import LoginRequest, RefreshRequest, TokenResponse
from src.modules.auth.service import AuthService

class AuthController:
    def __init__(self):
        self.service = AuthService()

    async def login(self, data: LoginRequest) -> TokenResponse:
        return await self.service.login(data)

    async def refrescar(self, data: RefreshRequest) -> TokenResponse:
        return await self.service.refrescar(data)