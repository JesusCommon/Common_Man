from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    correo: EmailStr = Field(...)
    password: str = Field(...)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str = Field(...)