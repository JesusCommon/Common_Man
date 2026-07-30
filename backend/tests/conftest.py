import pytest_asyncio
from pymongo_inmemory import MongoClient
from pymongo import AsyncMongoClient
from beanie import init_beanie
from src.modules.usuarios.document import Usuario
from src.modules.usuarios.repo import UsuarioRepo
from src.modules.usuarios.schema import UsuarioCreate
from src.core.security.password import hashear_password


@pytest_asyncio.fixture(scope="session", autouse=True)
async def mock_db():
    sync_client = MongoClient()
    # Wait for the server to be ready by pinging
    sync_client.admin.command('ping')
    port = sync_client.address[1]
    async_client = AsyncMongoClient(f"mongodb://localhost:{port}")
    db = async_client.test_db
    await init_beanie(database=db, document_models=[Usuario])
    yield db
    await async_client.close()
    sync_client.close()


@pytest_asyncio.fixture(autouse=True)
async def clean_collection(mock_db) -> None:
    await Usuario.delete_all()
    yield
    await Usuario.delete_all()


@pytest_asyncio.fixture
async def repo() -> UsuarioRepo:
    return UsuarioRepo()


@pytest_asyncio.fixture
async def usuario_ejemplo(repo: UsuarioRepo) -> Usuario:
    # Hash the password before storing
    hashed_password = hashear_password("Hashed_Password_123")
    data = UsuarioCreate(
        nombre="Jesus Manuel",
        apellido="Teran Vergara",
        username="jesusteran",
        telefono="+573122960906",
        correo="jesus@example.com",
        password=hashed_password
    )
    return await repo.crear(data)