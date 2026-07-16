import bcrypt
from fastapi import HTTPException, status
from app.models.usuarios_model import Usuario, RolUsuario
from app.schemas.usuarios_schema import UsuarioCreate, UsuarioUpdate, UsuarioCambiarPassword, UsuarioRecargarSaldo
from app.repos.usuarios_repo import UsuarioRepo
from beanie import PydanticObjectId
from uuid import UUID


def hashear_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


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

    async def listar(self) -> list[Usuario]:
        return await self.repo.listar()

    async def listar_activos(self) -> list[Usuario]:
        return await self.repo.listar_activos()

    async def listar_inactivos(self) -> list[Usuario]:
        return await self.repo.listar_inactivos()

    async def obtener_por_id(self, id: PydanticObjectId) -> Usuario:
        usuario = await self.repo.obtener_por_id(id)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con ID {id} No encontrado"
            )
        return usuario

    async def actualizar(self, id: PydanticObjectId, data: UsuarioUpdate) -> Usuario:
        usuario = await self.obtener_por_id(id)
        self._validar_activo(usuario)

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

    async def cambiar_password(self, id: PydanticObjectId, data: UsuarioCambiarPassword) -> Usuario:
        usuario = await self.obtener_por_id(id)
        self._validar_activo(usuario)

        if not verificar_password(data.password_actual, usuario.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contraseña actual es incorrecta"
            )

        nueva_hasheada = hashear_password(data.password)
        return await self.repo.actualizar_password(id, nueva_hasheada)

    async def recargar_saldo(self, id: PydanticObjectId, data: UsuarioRecargarSaldo) -> Usuario:
        usuario = await self.obtener_por_id(id)
        self._validar_activo(usuario)
        return await self.repo.recargar_saldo(id, data.monto)

    async def activar(self, id: PydanticObjectId) -> Usuario:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Usuario:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)
    
    async def obtener_por_identificador(self, identificador: UUID) -> Usuario:
        usuario = await self.repo.obtener_por_identificador(identificador)
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario con identificador {identificador} no encontrado"
            )
        return usuario
    
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