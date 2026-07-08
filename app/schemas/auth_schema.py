from pydantic import BaseModel, Field, EmailStr

class LoginRequest(BaseModel):
    correo : EmailStr = Field(...)
    password : str = Field(...)

class TokenResponse(BaseModel):
    access_token : str = Field(...)
    token_type : str = Field(default="bearer")
    