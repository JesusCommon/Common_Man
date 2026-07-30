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
from src.modules.usuarios.document import Usuario


settings = get_settings()
setup_logging(environment=settings.app.environment, debug=settings.app.debug)

document_models = [Usuario]


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

# ✅ 2. Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# ✅ 3. Routers DESPUÉS
app.include_router(usuarios_router)
app.include_router(auth_router)

@app.get("/")
async def health_check():
    return {"status": "ok", "environment": settings.app.environment}