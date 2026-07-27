from functools import lru_cache
from typing import Literal
from pydantic import SecretStr
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


class Settings:
    def __init__(self) -> None:
        self.app = AppSettings()
        self.mongo = MongoSettings()
        self.jwt = JWTSettings()


@lru_cache
def get_settings() -> Settings:
    return Settings()