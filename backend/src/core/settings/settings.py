from functools import lru_cache
from typing import Literal
from pydantic import SecretStr, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_prefix="APP_",
    )

    name: str
    version: str
    timezone: str
    locale: str
    environment: Literal["development", "staging", "production"]
    debug: bool

class MongoSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_prefix="MONGODB_",
    )

    url: str
    database: str
    pool_min_size: int
    pool_max_size: int
    server_selection_timeout_ms: int
    connect_timeout_ms: int
    socket_timeout_ms: int

class JWTSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_prefix="JWT_",
    )

    secret_key: SecretStr
    algorithm: str
    expire_minutes: int
    refresh_expire_days: int


class R2Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_prefix="R2_",
    )

    account_id: str = Field(..., description="Cloudflare Account ID")
    access_key_id: str = Field(..., description="R2 Access Key ID")
    secret_access_key: SecretStr = Field(
        ..., description="R2 Secret Access Key (secreto)"
    )
    bucket: str = Field(
        default="common-man-libros", description="Nombre del bucket R2"
    )
    endpoint: str = Field(..., description="Endpoint S3 de R2")

class CloudinarySettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_prefix="CLOUDINARY_",
    )

    cloud_name: str = Field(..., description="Cloud Name de Cloudinary")
    api_key: str = Field(..., description="API Key de Cloudinary")
    api_secret: SecretStr = Field(..., description="API Secret (secreto)")
    folder: str = Field(default="common-man", description="Carpeta raíz de assets")


class Settings:
    def __init__(self) -> None:
        self.app = AppSettings()
        self.mongo = MongoSettings()
        self.jwt = JWTSettings()
        self.r2 = R2Settings() 
        self.cloudinary = CloudinarySettings()


@lru_cache
def get_settings() -> Settings:
    return Settings()