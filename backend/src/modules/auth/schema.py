from pydantic import BaseModel, Field, field_validator


class LoginRequest(BaseModel):
    identidad: str = Field(
        ...,
        description="Correo electrónico o username del usuario",
        examples=["jesusteran", "example@gmail.com"]
    )
    password: str = Field(...)

    @field_validator("identidad", mode="before")
    @classmethod
    def normalizar_identidad(cls, v):
        if not isinstance(v, str):
            raise ValueError("La identidad debe ser texto")
        return v.strip().lower()

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str = Field(...)