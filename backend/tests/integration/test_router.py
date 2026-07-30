import pytest
from uuid import uuid4
from beanie import PydanticObjectId
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.core.security.jwt import obtener_usuario_actual, obtener_usuario_admin
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.usuarios.schema import UsuarioCreate
from src.modules.usuarios.repo import UsuarioRepo

# Helper functions to create user data
def user_create_data(**kwargs):
    base = {
        "nombre": "Test",
        "apellido": "User",
        "username": f"testuser{uuid4().hex[:8]}",
        "correo": f"testuser{uuid4().hex[:8]}@example.com",
        "password": "Password1!",
        # FIX 1: Telefono unico para evitar colisiones con fixtures
        "telefono": f"+{uuid4().int % 100000000000:012d}",
    }
    base.update(kwargs)
    return base


def user_update_data(**kwargs):
    return {k: v for k, v in kwargs.items() if v is not None}


def admin_update_data(**kwargs):
    return {k: v for k, v in kwargs.items() if v is not None}


def password_change_data(**kwargs):
    base = {
        "password_actual": "Password1!",
        "password": "NewPass1!",
    }
    base.update(kwargs)
    return base


def saldo_recarga_data(**kwargs):
    base = {"monto": 100}
    base.update(kwargs)
    return base


@pytest.fixture
async def test_user(usuario_ejemplo: Usuario):
    """Regular user fixture from conftest."""
    return usuario_ejemplo


@pytest.fixture
async def test_admin_user(repo: UsuarioRepo):
    """Create an admin user for testing admin endpoints."""
    admin_data = UsuarioCreate(
        nombre="Admin",
        apellido="User",
        username="adminuser",
        correo="admin@example.com",
        password="AdminPass1!",
        telefono="+1234567890",
    )
    admin_user = await repo.crear(admin_data)
    # Set role to admin
    admin_user.rol = RolUsuario.ADMIN
    await admin_user.save()
    return admin_user


@pytest.fixture
async def client(test_user: Usuario, test_admin_user: Usuario):
    """Create an async test client with dependency overrides for auth."""
    # Override the dependencies to return our test users
    app.dependency_overrides[obtener_usuario_actual] = lambda: test_user
    app.dependency_overrides[obtener_usuario_admin] = lambda: test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    # Clear overrides after the test
    app.dependency_overrides.clear()


# Test cases
class TestUsuarioRouter:
    # ============================================================
    # PUBLIC ENDPOINTS (no auth required)
    # ============================================================

    @pytest.mark.anyio
    async def test_crear_usuario(self, client: AsyncClient):
        """Test user creation endpoint."""
        data = user_create_data(username="newuser", correo="newuser@example.com")
        response = await client.post("/usuarios/", json=data)
        if response.status_code != 201:
            print(f"Unexpected status code: {response.status_code}")
            print(f"Response body: {response.text}")
        assert response.status_code == 201
        json_data = response.json()
        assert json_data["mensaje"] == "Usuario creado satisfactoriamente"
        assert "data" in json_data
        assert json_data["data"]["username"] == "newuser"
        assert json_data["data"]["correo"] == "newuser@example.com"

    @pytest.mark.anyio
    async def test_crear_usuario_duplicate_username(self, client: AsyncClient, test_user: Usuario):
        """Test duplicate username validation."""
        data = user_create_data(
            username=test_user.username,  # duplicate
            correo="another@example.com"
        )
        response = await client.post("/usuarios/", json=data)
        if response.status_code != 409:
            print(f"Unexpected status code: {response.status_code}")
            print(f"Response body: {response.text}")
        # FIX 2: Tu API devuelve 409 Conflict, no 400
        assert response.status_code == 409

    @pytest.mark.anyio
    async def test_crear_usuario_duplicate_email(self, client: AsyncClient, test_user: Usuario):
        """Test duplicate email validation."""
        data = user_create_data(
            username="anotheruser",
            correo=test_user.correo  # duplicate
        )
        response = await client.post("/usuarios/", json=data)
        if response.status_code != 409:
            print(f"Unexpected status code: {response.status_code}")
            print(f"Response body: {response.text}")
        # FIX 3: Tu API devuelve 409 Conflict, no 400
        assert response.status_code == 409

    # ============================================================
    # PROTECTED ENDPOINTS (require regular user)
    # ============================================================

    @pytest.mark.anyio
    async def test_buscar_personas(self, client: AsyncClient, test_user: Usuario):
        """Test search users endpoint."""
        # Create another user to search for
        other_data = user_create_data(username="searchuser", correo="search@example.com")
        response = await client.post("/usuarios/", json=other_data)
        assert response.status_code == 201

        # Search by username
        response = await client.get(
            "/usuarios/buscar",
            params={"username": "searchuser"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["username"] == "searchuser"

        # Search by name
        response = await client.get(
            "/usuarios/buscar",
            params={"nombre": "Test"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1  # at least the test_user

        # Search with pagination
        response = await client.get(
            "/usuarios/buscar",
            params={"skip": 0, "limit": 1}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 1

    @pytest.mark.anyio
    async def test_obtener_perfil_propio(self, client: AsyncClient, test_user: Usuario):
        """Test get own profile endpoint."""
        response = await client.get("/usuarios/me")
        assert response.status_code == 200
        data = response.json()
        # The UsuarioPropioResponse includes identificador (UUID) and other fields, but not the MongoDB id.
        # However, the Usuario document has an 'id' field (the MongoDB ObjectId). The response model
        # UsuarioPropioResponse inherits from UsuarioPublicResponse which does NOT include 'id'.
        # So we should not expect 'id' in the response. Instead, we expect 'identificador'.
        assert data["identificador"] == str(test_user.identificador)
        assert data["username"] == test_user.username
        assert data["correo"] == test_user.correo

    @pytest.mark.anyio
    async def test_actualizar_mi_perfil(self, client: AsyncClient, test_user: Usuario):
        """Test update own profile endpoint."""
        update_data = user_update_data(nombre="Updated Name", bio="New bio")
        response = await client.put("/usuarios/me", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Usuario actualizado correctamente"
        assert data["data"]["nombre"] == "Updated Name"
        assert data["data"]["bio"] == "New bio"
        # Ensure username and email unchanged
        assert data["data"]["username"] == test_user.username
        assert data["data"]["correo"] == test_user.correo

    @pytest.mark.anyio
    async def test_cambiar_mi_password(self, client: AsyncClient, test_user: Usuario):
        """Test change own password endpoint."""
        # FIX 4: El fixture crea el usuario con password en texto plano,
        # pero el service espera verificar contra un hash. Hasheamos primero.
        from src.core.security.password import hashear_password
        test_user.password = hashear_password("Password1!")
        await test_user.save()

        change_data = password_change_data()
        response = await client.patch("/usuarios/me/password", json=change_data)
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Contraseña actualizada correctamente"

    @pytest.mark.anyio
    async def test_recargar_mi_saldo(self, client: AsyncClient, test_user: Usuario):
        """Test recharge own balance endpoint."""
        assert test_user.saldo == 0  # from conftest
        reload_data = saldo_recarga_data(monto=500)
        response = await client.patch("/usuarios/me/saldo", json=reload_data)
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Saldo recargado con éxito"
        assert data["data"]["saldo"] == 500

    # ============================================================
    # ADMIN ENDPOINTS (require admin user)
    # ============================================================

    @pytest.mark.anyio
    async def test_listar_todos_usuarios(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test list all users endpoint (admin only)."""
        response = await client.get("/usuarios/all")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should have at least the admin and the regular user from fixtures
        usernames = [u["username"] for u in data]
        assert test_admin_user.username in usernames
        assert test_user.username in usernames

    @pytest.mark.anyio
    async def test_listar_usuarios_activos(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test list active users endpoint."""
        response = await client.get("/usuarios/activos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Both fixture users are active by default
        usernames = [u["username"] for u in data]
        assert test_admin_user.username in usernames
        # FIX 5: Faltaba inyectar test_user en la firma del test
        assert test_user.username in usernames

    @pytest.mark.anyio
    async def test_listar_usuarios_inactivos(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test list inactive users endpoint."""
        # First, deactivate a user
        user_id = test_user.id
        response = await client.patch(f"/usuarios/{user_id}/desactivar")
        assert response.status_code == 200

        # Now check inactive list
        response = await client.get("/usuarios/inactivos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        # The deactivated user should be in the list
        usernames = [u["username"] for u in data]
        assert test_user.username in usernames
        # Admin should not be in inactive list
        assert test_admin_user.username not in usernames

        # Test pagination
        response = await client.get("/usuarios/inactivos?skip=0&limit=1")
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 1

    @pytest.mark.anyio
    async def test_buscar_por_filtro_admin(self, client: AsyncClient, test_admin_user: Usuario):
        """Test admin search by filter endpoint."""
        # Create a user with specific attributes
        user_data = user_create_data(
            username="filteruser",
            correo="filter@example.com",
            nombre="Filter",
            apellido="User"
        )
        response = await client.post("/usuarios/", json=user_data)
        assert response.status_code == 201

        # Search by nombre
        response = await client.get(
            "/usuarios/admin/buscar",
            params={"nombre": "Filter"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["nombre"] == "Filter"

        # Search by apellido
        response = await client.get(
            "/usuarios/admin/buscar",
            params={"apellido": "User"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["apellido"] == "User"

        # Search by username
        response = await client.get(
            "/usuarios/admin/buscar",
            params={"username": "filteruser"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["username"] == "filteruser"

        # Search with pagination
        response = await client.get(
            "/usuarios/admin/buscar",
            params={"skip": 0, "limit": 1}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 1

    @pytest.mark.anyio
    async def test_obtener_por_identificador(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test get user by identifier (UUID) endpoint."""
        response = await client.get(f"/usuarios/identificador/{test_user.identificador}")
        assert response.status_code == 200
        data = response.json()
        assert data["identificador"] == str(test_user.identificador)
        assert data["username"] == test_user.username

    @pytest.mark.anyio
    async def test_obtener_por_id(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test get user by MongoID endpoint."""
        response = await client.get(f"/usuarios/{test_user.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(test_user.id)
        assert data["username"] == test_user.username

    @pytest.mark.anyio
    async def test_actualizar_usuario_admin(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test admin update user endpoint."""
        update_data = admin_update_data(nombre="Admin Updated", bio="Updated by admin")
        response = await client.put(f"/usuarios/{test_user.id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Usuario actualizado correctamente"
        assert data["data"]["nombre"] == "Admin Updated"
        assert data["data"]["bio"] == "Updated by admin"
        # Ensure username and email unchanged
        assert data["data"]["username"] == test_user.username
        assert data["data"]["correo"] == test_user.correo

    @pytest.mark.anyio
    async def test_recargar_saldo_admin(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test admin recharge user balance endpoint."""
        assert test_user.saldo == 0
        reload_data = saldo_recarga_data(monto=1500)
        response = await client.patch(f"/usuarios/{test_user.id}/saldo", json=reload_data)
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Saldo recargado con éxito"
        assert data["data"]["saldo"] == 1500

    @pytest.mark.anyio
    async def test_activar_usuario_admin(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test admin activate user endpoint."""
        # First deactivate the user
        await client.patch(f"/usuarios/{test_user.id}/desactivar")
        # Now activate
        response = await client.patch(f"/usuarios/{test_user.id}/activar")
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Usuario activado correctamente"
        assert data["data"]["activo"] is True

    @pytest.mark.anyio
    async def test_desactivar_usuario_admin(self, client: AsyncClient, test_admin_user: Usuario, test_user: Usuario):
        """Test admin deactivate user endpoint."""
        response = await client.patch(f"/usuarios/{test_user.id}/desactivar")
        assert response.status_code == 200
        data = response.json()
        assert data["mensaje"] == "Usuario desactivado correctamente"
        assert data["data"]["activo"] is False

    # ============================================================
    # ERROR CASES
    # ============================================================

    @pytest.mark.anyio
    async def test_obtener_usuario_inexistente_por_id(self, client: AsyncClient, test_admin_user: Usuario):
        """Test getting a non-existent user by MongoID."""
        fake_id = PydanticObjectId()
        response = await client.get(f"/usuarios/{fake_id}")
        assert response.status_code == 404  # Assuming not found returns 404

    @pytest.mark.anyio
    async def test_obtener_usuario_inexistente_por_identificador(self, client: AsyncClient, test_admin_user: Usuario):
        """Test getting a non-existent user by UUID."""
        fake_id = uuid4()
        response = await client.get(f"/usuarios/identificador/{fake_id}")
        assert response.status_code == 404

    @pytest.mark.anyio
    async def test_actualizar_usuario_inexistente(self, client: AsyncClient, test_admin_user: Usuario):
        """Test updating a non-existent user."""
        fake_id = PydanticObjectId()
        update_data = admin_update_data(nombre="Nonexistent")
        response = await client.put(f"/usuarios/{fake_id}", json=update_data)
        assert response.status_code == 404

    @pytest.mark.anyio
    async def test_recargar_saldo_inexistente(self, client: AsyncClient, test_admin_user: Usuario):
        """Recharging a non-existent user's balance."""
        fake_id = PydanticObjectId()
        reload_data = saldo_recarga_data(monto=100)
        response = await client.patch(f"/usuarios/{fake_id}/saldo", json=reload_data)
        assert response.status_code == 404

    @pytest.mark.anyio
    async def test_activar_usuario_inexistente(self, client: AsyncClient, test_admin_user: Usuario):
        """Activating a non-existent user."""
        fake_id = PydanticObjectId()
        response = await client.patch(f"/usuarios/{fake_id}/activar")
        assert response.status_code == 404

    @pytest.mark.anyio
    async def test_desactivar_usuario_inexistente(self, client: AsyncClient, test_admin_user: Usuario):
        """Deactivating a non-existent user."""
        fake_id = PydanticObjectId()
        response = await client.patch(f"/usuarios/{fake_id}/desactivar")
        assert response.status_code == 404