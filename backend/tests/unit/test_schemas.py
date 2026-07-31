import pytest
from pydantic import ValidationError
from src.modules.usuarios.schema import (
    UsuarioCreate, UsuarioUpdate, UsuarioAdminUpdate,
    UsuarioCambiarPassword, UsuarioRecargarSaldo, RolUsuario
)

class TestUsuarioCreate:

    def test_creacion_valida_completa(self):
        user = UsuarioCreate(
            nombre="Jesus Manuel",
            apellido="Teran Vergara",
            username="jesusteran",
            telefono="+573122960906",
            correo="Jesus@Example.COM",
            password="Letras80_"
        )
        assert user.nombre == "Jesus Manuel"
        assert user.apellido == "Teran Vergara"
        assert user.username == "jesusteran"
        assert user.telefono == "+573122960906"
        assert user.correo == "jesus@example.com"
        assert user.password == "Letras80_"

    def test_creacion_valida_minima(self):
        user = UsuarioCreate(
            nombre="Ana",
            username="ana123",
            correo="ana@test.com",
            password="Password1!"
        )
        assert user.nombre == "Ana"
        assert user.apellido is None
        assert user.telefono is None

    def test_nombre_con_espacios_se_limpian(self):
        user = UsuarioCreate(
            nombre="  jesus manuel  ",
            username="test",
            correo="test@test.com",
            password="Password1!"
        )
        assert user.nombre == "Jesus Manuel"

    def test_nombre_con_acentos_valido(self):
        user = UsuarioCreate(
            nombre="José María",
            username="josema",
            correo="jose@test.com",
            password="Password1!"
        )
        assert user.nombre == "José María"

    def test_nombre_con_ene_valido(self):
        user = UsuarioCreate(
            nombre="Niño",
            username="nino",
            correo="nino@test.com",
            password="Password1!"
        )
        assert user.nombre == "Niño"

    def test_nombre_corto_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="J", username="test", correo="a@b.com", password="Password1!")
        assert "al menos 2 caracteres" in str(exc.value)

    def test_nombre_con_numeros_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Jesús123", username="test", correo="a@b.com", password="Password1!")
        assert "solo puede llevar letras" in str(exc.value)

    def test_nombre_con_simbolos_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Jesús@", username="test", correo="a@b.com", password="Password1!")
        assert "solo puede llevar letras" in str(exc.value)

    def test_nombre_no_string_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre=123, username="test", correo="a@b.com", password="Password1!")
        assert "debe ser texto" in str(exc.value)

    def test_apellido_con_espacios_se_limpian(self):
        user = UsuarioCreate(
            nombre="Test",
            apellido="  teran vergara  ",
            username="test",
            correo="test@test.com",
            password="Password1!"
        )
        assert user.apellido == "Teran Vergara"

    def test_apellido_corto_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", apellido="T", username="test", correo="a@b.com", password="Password1!")
        assert "al menos 2 caracteres" in str(exc.value)

    def test_apellido_con_numeros_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", apellido="Teran123", username="test", correo="a@b.com", password="Password1!")
        assert "solo puede llevar letras" in str(exc.value)

    def test_username_se_convierte_a_minusculas(self):
        user = UsuarioCreate(
            nombre="Test",
            username="JESUSTERAN",
            correo="test@test.com",
            password="Password1!"
        )
        assert user.username == "jesusteran"

    def test_username_con_espacios_se_limpian(self):
        user = UsuarioCreate(
            nombre="Test",
            username="  jesusteran  ",
            correo="test@test.com",
            password="Password1!"
        )
        assert user.username == "jesusteran"

    def test_username_corto_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="ab", correo="a@b.com", password="Password1!")
        assert "minimo 3 caracteres" in str(exc.value)

    def test_username_con_guion_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="jesus-teran", correo="a@b.com", password="Password1!")
        assert "solo puede llevar letras, numero o guión bajo" in str(exc.value)

    def test_username_con_punto_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="jesus.teran", correo="a@b.com", password="Password1!")
        assert "solo puede llevar letras, numero o guión bajo" in str(exc.value)

    def test_username_no_string_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username=123, correo="a@b.com", password="Password1!")
        assert "tiene que ser texto" in str(exc.value)

    def test_telefono_con_plus_valido(self):
        user = UsuarioCreate(
            nombre="Test", username="test", telefono="+573122960906",
            correo="test@test.com", password="Password1!"
        )
        assert user.telefono == "+573122960906"

    def test_telefono_sin_plus_valido(self):
        user = UsuarioCreate(
            nombre="Test", username="test", telefono="3122960906",
            correo="test@test.com", password="Password1!"
        )
        assert user.telefono == "3122960906"

    def test_telefono_con_espacios_se_limpian(self):
        user = UsuarioCreate(
            nombre="Test", username="test", telefono="  3122960906  ",
            correo="test@test.com", password="Password1!"
        )
        assert user.telefono == "3122960906"

    def test_telefono_corto_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", telefono="123456", correo="a@b.com", password="Password1!")
        assert "Número telefónico inválido" in str(exc.value)

    def test_telefono_largo_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", telefono="1234567890123456", correo="a@b.com", password="Password1!")
        assert "Número telefónico inválido" in str(exc.value)

    def test_telefono_con_letras_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", telefono="312abc", correo="a@b.com", password="Password1!")
        assert "Número telefónico inválido" in str(exc.value)

    def test_telefono_no_string_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", telefono=3122960906, correo="a@b.com", password="Password1!")
        assert "debe ser texto" in str(exc.value)

    def test_correo_se_convierte_a_minusculas(self):
        user = UsuarioCreate(
            nombre="Test", username="test", correo="JESUS@EXAMPLE.COM", password="Password1!"
        )
        assert user.correo == "jesus@example.com"

    def test_correo_con_espacios_se_limpian(self):
        user = UsuarioCreate(
            nombre="Test", username="test", correo="  jesus@example.com  ", password="Password1!"
        )
        assert user.correo == "jesus@example.com"

    def test_correo_invalido_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="no-es-email", password="Password1!")
        assert "correo" in str(exc.value).lower()

    def test_correo_no_string_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo=12345, password="Password1!")
        assert "debe ser texto" in str(exc.value)

    def test_password_valida(self):
        user = UsuarioCreate(
            nombre="Test", username="test", correo="test@test.com", password="Letras80_"
        )
        assert user.password == "Letras80_"

    def test_password_corta_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password="Let1!")
        assert "al menos 8 caracteres" in str(exc.value)

    def test_password_sin_mayuscula_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password="letras80_")
        assert "al menos una Mayuscula" in str(exc.value)

    def test_password_sin_minuscula_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password="LETRAS80_")
        assert "al menos una minuscula" in str(exc.value)

    def test_password_sin_numero_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password="Letras__")
        assert "al menos un numero" in str(exc.value)

    def test_password_con_espacio_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password="Letras 80_")
        assert "no puede contener espacios" in str(exc.value)

    def test_password_sin_simbolo_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password="Letras80")
        assert "al menos un simbolo" in str(exc.value)

    def test_password_no_string_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCreate(nombre="Test", username="test", correo="a@b.com", password=12345678)
        assert "debe ser texto" in str(exc.value)


class TestUsuarioUpdate:

    def test_update_nombre_valido(self):
        update = UsuarioUpdate(nombre="  jesus manuel  ")
        assert update.nombre == "Jesus Manuel"

    def test_update_nombre_corto_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioUpdate(nombre="J")
        assert "al menos 2 caracteres" in str(exc.value)

    def test_update_apellido_valido(self):
        update = UsuarioUpdate(apellido="  teran vergara  ")
        assert update.apellido == "Teran Vergara"

    def test_update_username_valido(self):
        update = UsuarioUpdate(username="  JESUSTERAN  ")
        assert update.username == "jesusteran"

    def test_update_telefono_valido(self):
        update = UsuarioUpdate(telefono="+573122960906")
        assert update.telefono == "+573122960906"

    def test_update_correo_valido(self):
        update = UsuarioUpdate(correo="  JESUS@EXAMPLE.COM  ")
        assert update.correo == "jesus@example.com"

    def test_update_bio_valida(self):
        update = UsuarioUpdate(bio="  Mi biografía  ")
        assert update.bio == "Mi biografía"

    def test_update_bio_larga_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioUpdate(bio="x" * 281)
        assert "más de 280 caracteres" in str(exc.value)

    def test_update_bio_no_string_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioUpdate(bio=12345)
        assert "debe ser texto" in str(exc.value)

    def test_update_avatar_valido(self):
        update = UsuarioUpdate(avatar="https://example.com/avatar.jpg")
        assert str(update.avatar) == "https://example.com/avatar.jpg"

    def test_update_todos_campos_none(self):
        update = UsuarioUpdate()
        assert update.nombre is None
        assert update.apellido is None
        assert update.username is None
        assert update.telefono is None
        assert update.correo is None
        assert update.bio is None
        assert update.avatar is None

class TestUsuarioAdminUpdate:

    def test_update_rol_admin(self):
        update = UsuarioAdminUpdate(rol=RolUsuario.ADMIN)
        assert update.rol == RolUsuario.ADMIN

    def test_update_rol_usuario(self):
        update = UsuarioAdminUpdate(rol=RolUsuario.USUARIO)
        assert update.rol == RolUsuario.USUARIO

    def test_update_activo_true(self):
        update = UsuarioAdminUpdate(activo=True)
        assert update.activo is True

    def test_update_saldo_valido(self):
        update = UsuarioAdminUpdate(saldo=1000)
        assert update.saldo == 1000

    def test_update_saldo_negativo_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioAdminUpdate(saldo=-10)
        assert "Input should be greater than or equal to 0" in str(exc.value)

    def test_update_completo_admin(self):
        update = UsuarioAdminUpdate(
            nombre="Admin", rol=RolUsuario.ADMIN, activo=True, saldo=5000
        )
        assert update.nombre == "Admin"
        assert update.rol == RolUsuario.ADMIN
        assert update.activo is True
        assert update.saldo == 5000

class TestUsuarioCambiarPassword:

    def test_cambio_password_valido(self):
        cp = UsuarioCambiarPassword(password_actual="OldPass1!", password="NewPass1!")
        assert cp.password_actual == "OldPass1!"
        assert cp.password == "NewPass1!"

    def test_password_actual_requerido(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCambiarPassword(password="NewPass1!")
        assert "password_actual" in str(exc.value)

    def test_password_nueva_invalida_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCambiarPassword(password_actual="OldPass1!", password="weak")
        assert "al menos 8 caracteres" in str(exc.value)

    def test_password_nueva_sin_simbolo_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioCambiarPassword(password_actual="OldPass1!", password="NewPass123")
        assert "al menos un simbolo" in str(exc.value)

class TestUsuarioRecargarSaldo:

    def test_monto_entero_valido(self):
        rs = UsuarioRecargarSaldo(monto=1000)
        assert rs.monto == 1000

    def test_monto_string_valido(self):
        rs = UsuarioRecargarSaldo(monto="500")
        assert rs.monto == 500

    def test_monto_float_no_soportado_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioRecargarSaldo(monto=250.75)
        assert "número válido" in str(exc.value)

    def test_monto_cero_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioRecargarSaldo(monto=0)
        assert "mayor a 0" in str(exc.value)

    def test_monto_negativo_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioRecargarSaldo(monto=-100)
        assert "mayor a 0" in str(exc.value)

    def test_monto_string_invalido_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioRecargarSaldo(monto="abc")
        assert "número válido" in str(exc.value)

    def test_monto_no_numerico_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioRecargarSaldo(monto=[1, 2, 3])
        assert "debe ser un número" in str(exc.value)

    def test_monto_none_falla(self):
        with pytest.raises(ValidationError) as exc:
            UsuarioRecargarSaldo(monto=None)
        assert "debe ser un número" in str(exc.value)