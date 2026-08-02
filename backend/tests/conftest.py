from __future__ import annotations
from collections.abc import AsyncGenerator
from typing import Any
from uuid import uuid4
import pytest
import pytest_asyncio
from beanie import init_beanie
from httpx import ASGITransport, AsyncClient
from pymongo import AsyncMongoClient
from pymongo_inmemory import MongoClient
from src.core.security.password import hashear_password
from src.main import app
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.usuarios.repo import UsuarioRepo
from src.modules.usuarios.schema import UsuarioCreate

@pytest_asyncio.fixture(scope="session", autouse=True)
async def mock_db() -> AsyncGenerator[Any, None]:
    sync_client = MongoClient()
    sync_client.admin.command("ping")
    port = sync_client.address[1]

    async_client = AsyncMongoClient(f"mongodb://localhost:{port}")
    db = async_client.test_db
    await init_beanie(database=db, document_models=[Usuario])

    yield db

    await async_client.close()
    sync_client.close()


@pytest_asyncio.fixture(autouse=True)
async def clean_collection(mock_db: Any) -> AsyncGenerator[None, None]:
    await Usuario.delete_all()
    yield
    await Usuario.delete_all()

@pytest_asyncio.fixture
async def repo() -> UsuarioRepo:
    return UsuarioRepo()

@pytest_asyncio.fixture
async def usuario_ejemplo(repo: UsuarioRepo) -> Usuario:
    hashed_password = hashear_password("Hashed_Password_123")
    data = UsuarioCreate(
        nombre="Jesus Manuel",
        apellido="Teran Vergara",
        username="jesusteran",
        telefono="+573122960906",
        correo="jesus@example.com",
        password=hashed_password,
    )
    return await repo.crear(data)

def _unique_user_data(**kwargs: Any) -> dict[str, Any]:
    uid_num = uuid4().int % 100_000_000_000
    uid_str = uuid4().hex[:8]
    base: dict[str, Any] = {
        "nombre": "Test",
        "apellido": "Usuario",
        "username": f"user{uid_str}",
        "correo": f"user{uid_str}@test.com",
        "password": "Password1!",
        "telefono": f"+{uid_num:012d}",
    }
    base.update(kwargs)
    return base

@pytest_asyncio.fixture
async def client(mock_db: Any) -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def usuario_normal(client: AsyncClient, repo: UsuarioRepo) -> dict[str, Any]:
    data = _unique_user_data()

    response = await client.post("/usuarios/", json=data)
    assert response.status_code == 201, f"Error creando usuario: {response.text}"

    user_doc = await repo.obtener_por_username(data["username"])
    if user_doc is None:
        pytest.fail("Usuario creado no encontrado en la base de datos")

    login_resp = await client.post("/auth/login", json={
        "identidad": data["username"],
        "password": data["password"],
    })
    assert login_resp.status_code == 200, f"Error en login: {login_resp.text}"
    tokens = login_resp.json()

    return {
        "id": str(user_doc.id),
        "identificador": str(user_doc.identificador),
        "username": data["username"],
        "correo": data["correo"],
        "password": data["password"],
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
    }


@pytest_asyncio.fixture
async def usuario_admin(client: AsyncClient, repo: UsuarioRepo) -> dict[str, Any]:
    data = _unique_user_data()

    response = await client.post("/usuarios/", json=data)
    assert response.status_code == 201, f"Error creando admin: {response.text}"

    user_doc = await repo.obtener_por_username(data["username"])
    if user_doc is None:
        pytest.fail("Usuario admin no encontrado en la base de datos")

    user_doc.rol = RolUsuario.ADMIN
    await user_doc.save()

    login_resp = await client.post("/auth/login", json={
        "identidad": data["username"],
        "password": data["password"],
    })
    assert login_resp.status_code == 200, f"Error en login admin: {login_resp.text}"
    tokens = login_resp.json()

    return {
        "id": str(user_doc.id),
        "identificador": str(user_doc.identificador),
        "username": data["username"],
        "correo": data["correo"],
        "password": data["password"],
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
    }