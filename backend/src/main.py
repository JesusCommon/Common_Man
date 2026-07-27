from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.core.database.connection import connect_db, disconnect_db
from src.core.exceptions import (
    AppException,
    app_exception_handler,
    unhandled_exception_handler,
)
from src.core.logging import setup_logging
from src.core.settings.settings import get_settings
from src.modules.usuarios.route import router as usuarios_router
from src.modules.auth.route import router as auth_router
from src.modules.follow.route import router as follow_router
from src.modules.usuarios.document import Usuario
from src.modules.follow.document import Seguimiento

settings = get_settings()
setup_logging(environment=settings.app.environment, debug=settings.app.debug)

document_models = [Usuario, Seguimiento]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db(document_models)
    yield
    await disconnect_db()


app = FastAPI(
    title=settings.app.name,
    version=settings.app.version,
    lifespan=lifespan,
)

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)
app.include_router(usuarios_router)
app.include_router(auth_router)
app.include_router(follow_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "environment": settings.app.environment}