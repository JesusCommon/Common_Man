from fastapi import HTTPException, status
from src.modules.usuarios.document import Usuario, RolUsuario
from src.modules.usuarios.schema import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioAdminUpdate,
    UsuarioCambiarPassword,
    UsuarioRecargarSaldo,
)
from src.modules.usuarios.repo import UsuarioRepo
from src.core.security.password import hashear_password, verificar_password
from beanie import PydanticObjectId
from uuid import UUID


class UsuarioService:
    def __init__(self):
        self.repo = UsuarioRepo()

    def _validar_activo(self, usuario: Usuario) -> None:
        if not usuario.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un usuario inactivo"
            )

    async def crear(self, data: UsuarioCreate) -> Usuario:
        if await self.repo.obtener_por_correo(data.correo):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una cuenta registrada con el correo '{data.correo}'"
            )

        if await self.repo.obtener_por_username(data.username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"El username '{data.username}' ya está en uso"
            )

        if data.telefono and await self.repo.obtener_por_telefono(data.telefono):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe una cuenta registrada con el número '{data.telefono}'"
            )

        datos = data.model_dump(exclude_unset=True)
        datos["password"] = hashear_password(datos["password"])
        datos["rol"] = RolUsuario.USUARIO
        documento = Usuario(**datos)
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        return await self.repo.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        return await self.repo.listar_activos(skip=skip, limit=limit)
    
    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Usuario], int]:
        return await self.repo.listar_inactivos(skip=skip, limit=limit)

    async def obtener_por_id(self, id: PydanticObjectId) -> Usuario:
        usuario = await self.repo.obtener_por_id(id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        return usuario

    async def obtener_por_identificador(self, identificador: UUID) -> Usuario:
        usuario = await self.repo.obtener_por_identificador(identificador)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        return usuario

    async def _validar_conflictos(
        self, data: UsuarioUpdate, identificador_actual: UUID
    ) -> None:
        if data.correo:
            existente = await self.repo.obtener_por_correo(data.correo)
            if existente and existente.identificador != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un usuario con el correo '{data.correo}'"
                )

        if data.username:
            existente = await self.repo.obtener_por_username(data.username)
            if existente and existente.identificador != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El username '{data.username}' ya está en uso"
                )

        if data.telefono:
            existente = await self.repo.obtener_por_telefono(data.telefono)
            if existente and existente.identificador != identificador_actual:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un usuario con el número '{data.telefono}'"
                )

    async def actualizar(self, identificador: UUID, data: UsuarioUpdate) -> Usuario:
        usuario = await self.obtener_por_identificador(identificador)
        self._validar_activo(usuario)
        await self._validar_conflictos(data, identificador)
        return await self.repo.actualizar(usuario.id, data)

    async def cambiar_password(
        self, identificador: UUID, data: UsuarioCambiarPassword
    ) -> Usuario:
        usuario = await self.obtener_por_identificador(identificador)
        self._validar_activo(usuario)

        if not verificar_password(data.password_actual, usuario.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contraseña actual es incorrecta"
            )

        nueva_hasheada = hashear_password(data.password)
        return await self.repo.actualizar_password(identificador, nueva_hasheada)

    async def recargar_saldo(
        self, identificador: UUID, data: UsuarioRecargarSaldo
    ) -> Usuario:
        usuario = await self.obtener_por_identificador(identificador)
        self._validar_activo(usuario)
        return await self.repo.recargar_saldo(identificador, data.monto)

    async def buscar_personas(
        self,
        nombre: str | None = None,
        apellido: str | None = None,
        username: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Usuario]:
        return await self.repo.buscar_por_filtro(
            nombre=nombre,
            apellido=apellido,
            username=username,
            skip=skip,
            limit=limit,
            excluir_rol=RolUsuario.ADMIN,
            solo_activos=True,
        )

    async def obtener_perfil_publico(self, username: str) -> Usuario:
        usuario = await self.repo.obtener_por_username(username)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        return usuario

    async def actualizar_admin(
        self, id: PydanticObjectId, data: UsuarioAdminUpdate
    ) -> Usuario:
        usuario = await self.obtener_por_id(id)

        if data.correo:
            existente = await self.repo.obtener_por_correo(data.correo)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un usuario con el correo '{data.correo}'"
                )

        if data.username:
            existente = await self.repo.obtener_por_username(data.username)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El username '{data.username}' ya está en uso"
                )

        if data.telefono:
            existente = await self.repo.obtener_por_telefono(data.telefono)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un usuario con el número '{data.telefono}'"
                )

        return await self.repo.actualizar(id, data)

    async def recargar_saldo_admin(
        self, identificador: PydanticObjectId | UUID, data: UsuarioRecargarSaldo
    ) -> Usuario:
        if isinstance(identificador, PydanticObjectId):
            usuario = await self.obtener_por_id(identificador)
            filtro = {Usuario.id: identificador}
        else:
            usuario = await self.obtener_por_identificador(identificador)
            filtro = {Usuario.identificador: identificador}

        self._validar_activo(usuario)

        return await self.repo.recargar_saldo_admin(filtro, data.monto)

    async def restar_saldo_admin(
        self, identificador: PydanticObjectId | UUID, data: UsuarioRecargarSaldo) -> Usuario:
        if isinstance(identificador, PydanticObjectId):
            usuario = await self.obtener_por_id(identificador)
            filtro = {Usuario.id: identificador}
        else:
            usuario = await self.obtener_por_identificador(identificador)
            filtro = {Usuario.identificador: identificador}

        self._validar_activo(usuario)

        if usuario.saldo < data.monto:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Saldo insuficiente para realizar esta operación",
            )

        resultado = await self.repo.restar_saldo_admin(filtro, data.monto)
        if resultado is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El saldo cambió antes de completar la operación, intenta de nuevo",
            )
        return resultado

    async def activar(self, id: PydanticObjectId) -> Usuario:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Usuario:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        apellido: str | None = None,
        username: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Usuario]:
        return await self.repo.buscar_por_filtro(
            nombre=nombre,
            apellido=apellido,
            username=username,
            skip=skip,
            limit=limit,
        )