from pymongo import AsyncMongoClient
from beanie import init_beanie
from loguru import logger
from app.settings.settings import get_settings

settings = get_settings()
_client: AsyncMongoClient | None = None

def get_mongo_client() -> AsyncMongoClient:
    global _client
    if _client is None:
        _client = AsyncMongoClient(
            settings.mongo.url,
            minPoolSize=settings.mongo.pool_min_size,
            maxPoolSize=settings.mongo.pool_max_size,
            serverSelectionTimeoutMS=settings.mongo.server_selection_timeout_ms,
            connectTimeoutMS=settings.mongo.connect_timeout_ms,
            socketTimeoutMS=settings.mongo.socket_timeout_ms
        )
    return _client

async def connect_db(document_models: list) -> None:
    cliente = get_mongo_client()
    database = cliente[settings.mongo.database]

    await init_beanie(
        database=database,
        document_models=document_models,
    )
    logger.success(f"MongoDB Conectado -- Base de datos: {settings.mongo.database}")

async def disconnect_db() -> None:
    global _client
    if _client is not None:
        await _client.close()
        _client = None
        logger.info("MongoDB desconectado")