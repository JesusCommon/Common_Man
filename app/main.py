from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.cors import configurar_cors
from app.database.connection import connect_db, disconnect_db
from app.models.usuarios_model import Usuario
from app.models.follow_model import Seguimiento
from app.models.categoria_libro_model import CategoriaLibro
from app.models.categoria_producto_model import CategoriaProducto
from app.models.libros_model import Libro
from app.models.productos_model import Producto
from app.models.compra_libro_model import CompraLibro
from app.models.compra_producto_model import CompraProducto
from app.routes.usuarios_route import router as usuarios_router
from app.routes.auth_route import router as auth_router
from app.routes.categoria_libro_route import router as categoria_libro_router
from app.routes.libros_route import router as libros_router
from app.routes.compra_libro_repo import router as compra_libro_router
from app.routes.categoria_producto_route import router as categoria_producto_router
from app.routes.productos_route import router as productos_router
from app.routes.compra_producto_route import router as compra_producto_router
from app.routes.follow_route import router as follow_usuarios

DOCUMENT_MODELS = [Usuario, Seguimiento, CategoriaProducto, CategoriaLibro, Libro, Producto, CompraLibro, CompraProducto]


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
app.include_router(categoria_producto_router)
app.include_router(libros_router)
app.include_router(productos_router)
app.include_router(follow_usuarios)
app.include_router(compra_libro_router)
app.include_router(compra_producto_router)