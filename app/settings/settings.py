from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

ENV_CONFIG = {
    "env_file": ".env",
    "env_file_encoding": "utf-8",
    "extra": "ignore",
    "populate_by_name": True,
}

class AppSettings(BaseSettings):
    model_config=ENV_CONFIG

    name : str = Field(alias="APP_NAME")
    version : str = Field(alias="APP_VERSION")
    timezone : str = Field(alias="APP_TIMEZONE")
    locale : str = Field(alias="APP_LOCALE")
    Environment : str = Field(alias="ENVIRONMENT")
    debug : bool = Field(alias="DEBUG")

class MongoSettings(BaseSettings):
    model_config=ENV_CONFIG

    url : str = Field(alias="MONGODB_URL")
    database : str = Field(alias="MONGODB_DATABASE")
    pool_min_size : int = Field(alias="MONGODB_POOL_MIN_SIZE")
    pool_max_size : int = Field(alias="MONGODB_POOL_MAX_SIZE")
    server_selection_timeout_ms : int = Field(alias="MONGODB_SERVER_SELECTION_TIMEOUT_MS")
    connect_timeout_ms : int = Field(alias="MONGODB_CONNECT_TIMEOUT_MS")
    socket_timeout_ms : int = Field(alias="MONGODB_SOCKET_TIMEOUT_MS")

class JWTSettings(BaseSettings):
    model_config=ENV_CONFIG

    secret_key : str = Field(alias="JWT_SECRET_KEY")
    algorithm : str = Field(alias="JWT_ALGORITHM")
    expire_minutes : int = Field(alias="JWT_EXPIRE_MINUTES")


class Settings:
    def __init__(self) -> None:
        self.app = AppSettings()
        self.mongo = MongoSettings()
        self.jwt = JWTSettings()

@lru_cache
def get_settings() -> Settings:
    return Settings()
        
