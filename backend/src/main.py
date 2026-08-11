from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from src.core.cors import setup_cors               
from src.core.database.connection import connect_db, disconnect_db
from src.core.exceptions import (
    AppException,
    app_exception_handler,
    unhandled_exception_handler,
)
from src.core.logging import setup_logging
from src.core.rate_limit import RATE_LIMIT_ENABLED
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
setup_cors(app)                                               

if RATE_LIMIT_ENABLED:
    from slowapi.errors import RateLimitExceeded
    from slowapi.middleware import SlowAPIMiddleware

    def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={
                "error": "Too Many Requests",
                "message": str(exc.detail),
                "retry_after": exc.description,
            },
            headers={"Retry-After": str(exc.description)},
        )

    from src.core.rate_limit import limiter
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)
    app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(usuarios_router)
app.include_router(auth_router)

@app.get("/")
async def health_check():
    return {"status": "ok", "environment": settings.app.environment}