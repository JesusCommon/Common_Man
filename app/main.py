from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.cors import configurar_cors
from app.database.connection import connect_db, disconnect_db
from app.models.usuarios_model import Usuario
from app.models.follow import Seguimiento
from app.routes.usuarios_route import router as usuarios_router
from app.routes.auth_route import router as auth_router

DOCUMENT_MODELS = [Usuario, Seguimiento]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db(DOCUMENT_MODELS)
    yield
    await disconnect_db()


app = FastAPI(title="Simulador de Compras", version="1.0.0", lifespan=lifespan)
configurar_cors(app)


app.include_router(usuarios_router)
app.include_router(auth_router)