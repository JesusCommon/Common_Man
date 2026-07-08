from app.services.auth_service import AuthService
from app.schemas.auth_schema import LoginRequest, TokenResponse

class AuthController:
    def __init__(self):
        self.service = AuthService()

    async def login(self, data: LoginRequest) -> TokenResponse:
        return await self.service.login(data)
    