import pytest
from uuid import UUID
from beanie import PydanticObjectId
from src.modules.usuarios.repo import UsuarioRepo
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.usuarios.schema import UsuarioCreate, UsuarioUpdate

# ============================================================
# BASE REPO (CRUD)
# ============================================================

class TestBaseRepoCRUD:
    """Tests para operaciones CRUD heredadas de BaseRepo."""

    async def test_crear_usuario_persiste_datos(self, repo: UsuarioRepo):
        data = UsuarioCreate(
            nombre="Ana",
            username="ana123",
            correo="ana@test.com",
            password="hashed_pass"
        )
        usuario = await repo.crear(data)

        assert usuario.id is not None
        assert usuario.nombre == "Ana"
        assert usuario.username == "ana123"
        assert usuario.correo == "ana@test.com"
        assert usuario.password == "hashed_pass"
        assert usuario.activo is True
        assert isinstance(usuario.identificador, UUID)

    async def test_listar_devuelve_todos(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="A", username="a", correo="a@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="B", username="b", correo="b@t.com", password="p"))

        usuarios = await repo.listar()
        assert len(usuarios) == 2

    async def test_obtener_por_id_existente(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        encontrado = await repo.obtener_por_id(usuario_ejemplo.id)
        assert encontrado is not None
        assert encontrado.id == usuario_ejemplo.id
        assert encontrado.nombre == "Jesus Manuel"

    async def test_obtener_por_id_inexistente(self, repo: UsuarioRepo):
        fake_id = PydanticObjectId()
        encontrado = await repo.obtener_por_id(fake_id)
        assert encontrado is None

    async def test_actualizar_usuario(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        update = UsuarioUpdate(nombre="Jesus Actualizado", bio="Nueva bio")
        actualizado = await repo.actualizar(usuario_ejemplo.id, update)

        assert actualizado is not None
        assert actualizado.nombre == "Jesus Actualizado"
        assert actualizado.bio == "Nueva bio"
        assert actualizado.username == "jesusteran"
        assert actualizado.correo == "jesus@example.com"

    async def test_actualizar_usuario_inexistente(self, repo: UsuarioRepo):
        fake_id = PydanticObjectId()
        update = UsuarioUpdate(nombre="Test")
        resultado = await repo.actualizar(fake_id, update)
        assert resultado is None


# ============================================================
# BASE REPO CON ESTADO
# ============================================================

class TestBaseRepoConEstado:
    """Tests para operaciones de estado (activar/desactivar)."""

    async def test_listar_activos_solo_activos(self, repo: UsuarioRepo):
        activo = await repo.crear(UsuarioCreate(nombre="Activo", username="activo", correo="act@test.com", password="p"))
        inactivo = await repo.crear(UsuarioCreate(nombre="Inactivo", username="inactivo", correo="inact@test.com", password="p"))
        await repo.desactivar(inactivo.id)

        activos = await repo.listar_activos()
        assert len(activos) == 1
        assert activos[0].nombre == "Activo"

    async def test_desactivar_usuario(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        assert usuario_ejemplo.activo is True

        resultado = await repo.desactivar(usuario_ejemplo.id)
        assert resultado is not None
        assert resultado.activo is False

        verificado = await repo.obtener_por_id(usuario_ejemplo.id)
        assert verificado.activo is False

    async def test_activar_usuario(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        await repo.desactivar(usuario_ejemplo.id)

        resultado = await repo.activar(usuario_ejemplo.id)
        assert resultado is not None
        assert resultado.activo is True

    async def test_activar_usuario_inexistente(self, repo: UsuarioRepo):
        fake_id = PydanticObjectId()
        resultado = await repo.activar(fake_id)
        assert resultado is None

    async def test_desactivar_usuario_inexistente(self, repo: UsuarioRepo):
        fake_id = PydanticObjectId()
        resultado = await repo.desactivar(fake_id)
        assert resultado is None


# ============================================================
# USUARIO REPO - BÚSQUEDAS ESPECÍFICAS
# ============================================================

class TestUsuarioRepoBusquedas:
    """Tests para búsquedas específicas de usuario."""

    async def test_obtener_por_correo_existente(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        encontrado = await repo.obtener_por_correo("jesus@example.com")
        assert encontrado is not None
        assert encontrado.id == usuario_ejemplo.id

    async def test_obtener_por_correo_inexistente(self, repo: UsuarioRepo):
        encontrado = await repo.obtener_por_correo("noexiste@test.com")
        assert encontrado is None

    async def test_obtener_por_username_existente(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        encontrado = await repo.obtener_por_username("jesusteran")
        assert encontrado is not None
        assert encontrado.id == usuario_ejemplo.id

    async def test_obtener_por_username_inexistente(self, repo: UsuarioRepo):
        encontrado = await repo.obtener_por_username("nouser")
        assert encontrado is None

    async def test_obtener_por_identificador_existente(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        encontrado = await repo.obtener_por_identificador(usuario_ejemplo.identificador)
        assert encontrado is not None
        assert encontrado.id == usuario_ejemplo.id

    async def test_obtener_por_identificador_inexistente(self, repo: UsuarioRepo):
        encontrado = await repo.obtener_por_identificador(UUID("12345678-1234-5678-1234-567812345678"))
        assert encontrado is None

    async def test_obtener_por_telefono_existente(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        encontrado = await repo.obtener_por_telefono("+573122960906")
        assert encontrado is not None
        assert encontrado.id == usuario_ejemplo.id

    async def test_obtener_por_telefono_inexistente(self, repo: UsuarioRepo):
        encontrado = await repo.obtener_por_telefono("+999999999")
        assert encontrado is None

    async def test_listar_inactivos(self, repo: UsuarioRepo):
        activo = await repo.crear(UsuarioCreate(nombre="Act", username="act", correo="act@t.com", password="p"))
        inactivo = await repo.crear(UsuarioCreate(nombre="Inact", username="inact", correo="inact@t.com", password="p"))
        await repo.desactivar(inactivo.id)

        inactivos = await repo.listar_inactivos()
        assert len(inactivos) == 1
        assert inactivos[0].nombre == "Inact"

    async def test_listar_inactivos_con_paginacion(self, repo: UsuarioRepo):
        for i in range(5):
            u = await repo.crear(UsuarioCreate(nombre=f"Inact{i}", username=f"inact{i}", correo=f"inact{i}@t.com", password="p"))
            await repo.desactivar(u.id)

        inactivos = await repo.listar_inactivos(skip=2, limit=2)
        assert len(inactivos) == 2


# ============================================================
# USUARIO REPO - OPERACIONES ESPECÍFICAS
# ============================================================

class TestUsuarioRepoOperaciones:
    """Tests para operaciones específicas: password, saldo, etc."""

    async def test_actualizar_password(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        nueva_pass = "nuevo_hash_456"
        actualizado = await repo.actualizar_password(usuario_ejemplo.identificador, nueva_pass)

        assert actualizado is not None
        assert actualizado.password == nueva_pass

        verificado = await repo.obtener_por_identificador(usuario_ejemplo.identificador)
        assert verificado.password == nueva_pass

    async def test_actualizar_password_identificador_inexistente(self, repo: UsuarioRepo):
        resultado = await repo.actualizar_password(UUID("12345678-1234-5678-1234-567812345678"), "pass")
        assert resultado is None

    async def test_actualizar_password_admin(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        nueva_pass = "admin_hash_789"
        actualizado = await repo.actualizar_password_admin(usuario_ejemplo.id, nueva_pass)

        assert actualizado is not None
        assert actualizado.password == nueva_pass

    async def test_actualizar_password_admin_id_inexistente(self, repo: UsuarioRepo):
        fake_id = PydanticObjectId()
        resultado = await repo.actualizar_password_admin(fake_id, "pass")
        assert resultado is None

    async def test_recargar_saldo(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        assert usuario_ejemplo.saldo == 0

        actualizado = await repo.recargar_saldo(usuario_ejemplo.identificador, 1000)
        assert actualizado is not None
        assert actualizado.saldo == 1000

    async def test_recargar_saldo_acumulativo(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        await repo.recargar_saldo(usuario_ejemplo.identificador, 500)
        actualizado = await repo.recargar_saldo(usuario_ejemplo.identificador, 300)

        assert actualizado is not None
        assert actualizado.saldo == 800

    async def test_recargar_saldo_identificador_inexistente(self, repo: UsuarioRepo):
        resultado = await repo.recargar_saldo(UUID("12345678-1234-5678-1234-567812345678"), 100)
        assert resultado is None

    async def test_recargar_saldo_admin(self, repo: UsuarioRepo, usuario_ejemplo: Usuario):
        actualizado = await repo.recargar_saldo_admin(usuario_ejemplo.id, 2000)
        assert actualizado is not None
        assert actualizado.saldo == 2000

    async def test_recargar_saldo_admin_id_inexistente(self, repo: UsuarioRepo):
        fake_id = PydanticObjectId()
        resultado = await repo.recargar_saldo_admin(fake_id, 100)
        assert resultado is None


# ============================================================
# USUARIO REPO - BÚSQUEDA POR FILTRO
# ============================================================

class TestUsuarioRepoBuscarPorFiltro:
    """Tests para búsqueda avanzada con filtros."""

    async def test_buscar_por_nombre(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="Jesus Manuel", username="jesus", correo="j@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="Ana Maria", username="ana", correo="a@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(nombre="jesus")
        assert len(resultados) == 1
        assert resultados[0].nombre == "Jesus Manuel"

    async def test_buscar_por_nombre_case_insensitive(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="Jesus Manuel", username="jesus", correo="j@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(nombre="JESUS")
        assert len(resultados) == 1

    async def test_buscar_por_apellido(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="Test", apellido="Teran", username="t1", correo="t1@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="Test", apellido="Garcia", username="t2", correo="t2@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(apellido="teran")
        assert len(resultados) == 1
        assert resultados[0].apellido == "Teran"

    async def test_buscar_por_username(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="Test", username="jesusteran", correo="t1@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="Test", username="anamaria", correo="t2@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(username="jesus")
        assert len(resultados) == 1
        assert resultados[0].username == "jesusteran"

    async def test_buscar_excluir_rol(self, repo: UsuarioRepo):
        admin = await repo.crear(UsuarioCreate(nombre="Admin", username="admin", correo="admin@t.com", password="p"))
        admin.rol = RolUsuario.ADMIN
        await admin.save()

        await repo.crear(UsuarioCreate(nombre="User", username="user", correo="user@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(excluir_rol=RolUsuario.ADMIN)
        assert len(resultados) == 1
        assert resultados[0].nombre == "User"

    async def test_buscar_solo_activos(self, repo: UsuarioRepo):
        activo = await repo.crear(UsuarioCreate(nombre="Activo", username="act", correo="act@t.com", password="p"))
        inactivo = await repo.crear(UsuarioCreate(nombre="Inactivo", username="inact", correo="inact@t.com", password="p"))
        await repo.desactivar(inactivo.id)

        resultados = await repo.buscar_por_filtro(solo_activos=True)
        assert len(resultados) == 1
        assert resultados[0].nombre == "Activo"

    async def test_buscar_combinado(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="Jesus", apellido="Teran", username="jesus", correo="j@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="Jesus", apellido="Garcia", username="jesus2", correo="j2@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="Ana", apellido="Teran", username="ana", correo="a@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(nombre="jesus", apellido="teran")
        assert len(resultados) == 1
        assert resultados[0].apellido == "Teran"

    async def test_buscar_con_paginacion(self, repo: UsuarioRepo):
        for i in range(10):
            await repo.crear(UsuarioCreate(nombre=f"User{i}", username=f"user{i}", correo=f"u{i}@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(skip=5, limit=3)
        assert len(resultados) == 3

    async def test_buscar_sin_filtros_devuelve_todos(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="A", username="a", correo="a@t.com", password="p"))
        await repo.crear(UsuarioCreate(nombre="B", username="b", correo="b@t.com", password="p"))

        resultados = await repo.buscar_por_filtro()
        assert len(resultados) == 2

    async def test_buscar_sin_resultados(self, repo: UsuarioRepo):
        await repo.crear(UsuarioCreate(nombre="Test", username="test", correo="test@t.com", password="p"))

        resultados = await repo.buscar_por_filtro(nombre="inexistente")
        assert len(resultados) == 0