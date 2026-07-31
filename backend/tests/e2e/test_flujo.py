from __future__ import annotations
from datetime import UTC, datetime, timedelta
from typing import Any
import pytest
from httpx import AsyncClient
from jose import jwt
from src.core.settings.settings import get_settings

class TestFlujoUsuarioCompleto:
    async def test_registro_login_y_perfil(
        self, client: AsyncClient, usuario_normal: dict[str, Any]
    ) -> None:
        response = await client.get(
            "/usuarios/me",
            headers={"Authorization": f"Bearer {usuario_normal['access_token']}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == usuario_normal["username"]
        assert data["correo"] == usuario_normal["correo"]

    async def test_actualizar_perfil(
        self, client: AsyncClient, usuario_normal: dict[str, Any]
    ) -> None:
        response = await client.put(
            "/usuarios/me",
            json={"nombre": "Actualizado Test", "bio": "Bio de prueba"},
            headers={"Authorization": f"Bearer {usuario_normal['access_token']}"},
        )
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["nombre"] == "Actualizado Test"
        assert data["bio"] == "Bio de prueba"

    async def test_cambiar_password_y_relogin(
        self, client: AsyncClient, usuario_normal: dict[str, Any]
    ) -> None:
        response = await client.patch(
            "/usuarios/me/password",
            json={"password_actual": usuario_normal["password"], "password": "NuevaPass1!"},
            headers={"Authorization": f"Bearer {usuario_normal['access_token']}"},
        )
        assert response.status_code == 200

        login_resp = await client.post("/auth/login", json={
            "identidad": usuario_normal["username"],
            "password": "NuevaPass1!",
        })
        assert login_resp.status_code == 200
        assert "access_token" in login_resp.json()

        old_login = await client.post("/auth/login", json={
            "identidad": usuario_normal["username"],
            "password": usuario_normal["password"],
        })
        assert old_login.status_code == 401

    async def test_recargar_saldo(
        self, client: AsyncClient, usuario_normal: dict[str, Any]
    ) -> None:
        response = await client.patch(
            "/usuarios/me/saldo",
            json={"monto": 2500},
            headers={"Authorization": f"Bearer {usuario_normal['access_token']}"},
        )
        assert response.status_code == 200
        assert response.json()["data"]["saldo"] == 2500

        response = await client.patch(
            "/usuarios/me/saldo",
            json={"monto": 500},
            headers={"Authorization": f"Bearer {usuario_normal['access_token']}"},
        )
        assert response.status_code == 200
        assert response.json()["data"]["saldo"] == 3000

    async def test_refresh_token(
        self, client: AsyncClient, usuario_normal: dict[str, Any]
    ) -> None:
        response = await client.post("/auth/refresh", json={
            "refresh_token": usuario_normal["refresh_token"],
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

        me_resp = await client.get(
            "/usuarios/me",
            headers={"Authorization": f"Bearer {data['access_token']}"},
        )
        assert me_resp.status_code == 200

class TestFlujoAdminCompleto:
    async def test_admin_lista_y_busca(
        self,
        client: AsyncClient,
        usuario_admin: dict[str, Any],
        usuario_normal: dict[str, Any],
    ) -> None:
        headers = {"Authorization": f"Bearer {usuario_admin['access_token']}"}

        response = await client.get("/usuarios/all", headers=headers)
        assert response.status_code == 200
        data = response.json()
        usernames = [u["username"] for u in data]
        assert usuario_admin["username"] in usernames
        assert usuario_normal["username"] in usernames

        response = await client.get(
            "/usuarios/admin/buscar",
            params={"nombre": "Test"},
            headers=headers,
        )
        assert response.status_code == 200
        assert len(response.json()) >= 2

    async def test_admin_actualiza_y_recarga_saldo(
        self,
        client: AsyncClient,
        usuario_admin: dict[str, Any],
        usuario_normal: dict[str, Any],
    ) -> None:
        headers = {"Authorization": f"Bearer {usuario_admin['access_token']}"}

        response = await client.put(
            f"/usuarios/{usuario_normal['id']}",
            json={"nombre": "Modificado por Admin", "rol": "usuario"},
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["data"]["nombre"] == "Modificado Por Admin"

        response = await client.patch(
            f"/usuarios/{usuario_normal['id']}/saldo",
            json={"monto": 9999},
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["data"]["saldo"] == 9999

    async def test_admin_activa_desactiva(
        self,
        client: AsyncClient,
        usuario_admin: dict[str, Any],
        usuario_normal: dict[str, Any],
    ) -> None:
        headers = {"Authorization": f"Bearer {usuario_admin['access_token']}"}

        response = await client.patch(
            f"/usuarios/{usuario_normal['id']}/desactivar",
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["data"]["activo"] is False

        login_resp = await client.post("/auth/login", json={
            "identidad": usuario_normal["username"],
            "password": usuario_normal["password"],
        })
        assert login_resp.status_code == 403

        response = await client.patch(
            f"/usuarios/{usuario_normal['id']}/activar",
            headers=headers,
        )
        assert response.status_code == 200
        assert response.json()["data"]["activo"] is True

        login_resp = await client.post("/auth/login", json={
            "identidad": usuario_normal["username"],
            "password": usuario_normal["password"],
        })
        assert login_resp.status_code == 200

class TestFlujoSeguridad:
    async def test_token_invalido(self, client: AsyncClient) -> None:
        response = await client.get(
            "/usuarios/me",
            headers={"Authorization": "Bearer token_falso_123"},
        )
        assert response.status_code == 401

    async def test_token_expirado_simulado(
        self,
        client: AsyncClient,
        usuario_normal: dict[str, Any],
    ) -> None:
        settings = get_settings()

        token_expirado = jwt.encode(
            {
                "sub": str(usuario_normal["identificador"]),
                "exp": datetime.now(UTC) - timedelta(hours=1),
                "type": "access",
            },
            settings.jwt.secret_key.get_secret_value(),
            algorithm=settings.jwt.algorithm,
        )
        response = await client.get(
            "/usuarios/me",
            headers={"Authorization": f"Bearer {token_expirado}"},
        )
        assert response.status_code == 401

    async def test_usuario_normal_no_puede_admin(
        self,
        client: AsyncClient,
        usuario_normal: dict[str, Any],
    ) -> None:
        headers = {"Authorization": f"Bearer {usuario_normal['access_token']}"}

        response = await client.get("/usuarios/all", headers=headers)
        assert response.status_code == 403

        response = await client.get("/usuarios/admin/buscar", headers=headers)
        assert response.status_code == 403

    async def test_refresh_token_invalido(self, client: AsyncClient) -> None:
        response = await client.post("/auth/refresh", json={
            "refresh_token": "token_refresh_falso",
        })
        assert response.status_code == 401

    async def test_buscar_personas_excluye_admins(
        self,
        client: AsyncClient,
        usuario_admin: dict[str, Any],
        usuario_normal: dict[str, Any],
    ) -> None:
        headers = {"Authorization": f"Bearer {usuario_normal['access_token']}"}

        response = await client.get("/usuarios/buscar", headers=headers)
        assert response.status_code == 200
        data = response.json()
        usernames = [u["username"] for u in data]
        assert usuario_admin["username"] not in usernames
        assert usuario_normal["username"] in usernames