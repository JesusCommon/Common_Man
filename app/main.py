from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.cors import configurar_cors
from app.database.connection import connect_db, disconnect_db
from app.models.usuarios_model import Usuario
from app.models.follow import Seguimiento
from app.models.categoria_libro_model import CategoriaLibro
from app.models.categoria_tienda_model import CategoriaTienda
from app.models.libros_model import Libro
from app.models.tienda_model import ProductoTienda
from app.routes.usuarios_route import router as usuarios_router
from app.routes.auth_route import router as auth_router
from app.routes.categoria_libro_route import router as categoria_libro_router
from app.routes.libros_route import router as libros_router
from app.routes.categoria_tienda_route import router as categoria_tienda_router
from app.routes.tienda_route import router as tienda_router

DOCUMENT_MODELS = [Usuario, Seguimiento, CategoriaTienda, CategoriaLibro, Libro, ProductoTienda]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db(DOCUMENT_MODELS)
    yield
    await disconnect_db()


app = FastAPI(title="Simulador de Compras", version="1.0.0", lifespan=lifespan)
configurar_cors(app)


app.include_router(usuarios_router)
app.include_router(auth_router)
app.include_router(categoria_libro_router)
app.include_router(categoria_tienda_router)
app.include_router(libros_router)
app.include_router(tienda_router)