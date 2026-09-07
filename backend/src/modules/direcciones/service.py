from fastapi import HTTPException, status
from beanie import PydanticObjectId
from src.modules.direcciones.document import Direcciones
from src.modules.direcciones.schema import DireccionCreate, DireccionUpdate
from src.modules.direcciones.repo import DireccionRepo

MAX_DIRECCIONES_POR_USUARIO = 10

class DireccionService:
    def __init__(self):
        self.repo = DireccionRepo()

    async def _validar_direccion_del_usuario(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        direccion = await self.repo.obtener_por_id(id)
        
        if not direccion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Dirección no encontrada"
            )
        
        if direccion.usuario_id != usuario_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para acceder a esta dirección"
            )
        
        return direccion

    async def _validar_alias_unico(
        self,
        usuario_id: PydanticObjectId,
        alias: str,
        excluir_id: PydanticObjectId | None = None,
    ) -> None:

        if await self.repo.verificar_alias_duplicado(usuario_id, alias, excluir_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya tienes una dirección con el alias '{alias}'"
            )

    async def crear(
        self, data: DireccionCreate, usuario_id: PydanticObjectId
    ) -> Direcciones:
        total = await self.repo.contar_por_usuario(usuario_id)
        if total >= MAX_DIRECCIONES_POR_USUARIO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No puedes tener más de {MAX_DIRECCIONES_POR_USUARIO} direcciones"
            )

        await self._validar_alias_unico(usuario_id, data.alias)
        direccion_predeterminada = await self.repo.obtener_predeterminada(usuario_id)
        if direccion_predeterminada is None:
            data.es_predeterminada = True
        elif data.es_predeterminada:
            await self.repo.desmarcar_predeterminada(usuario_id)

        documento = Direcciones(
            usuario_id=usuario_id,
            **data.model_dump()
        )
        await documento.insert()
        
        return documento

    async def listar_por_usuario(
        self,
        usuario_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Direcciones], int]:
        return await self.repo.listar_por_usuario(
            usuario_id=usuario_id,
            skip=skip,
            limit=limit,
            solo_activas=True
        )

    async def obtener_por_id(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        return await self._validar_direccion_del_usuario(id, usuario_id)

    async def actualizar(
        self,
        id: PydanticObjectId,
        data: DireccionUpdate,
        usuario_id: PydanticObjectId,
    ) -> Direcciones:
        direccion = await self._validar_direccion_del_usuario(id, usuario_id)
        if data.alias is not None:
            await self._validar_alias_unico(usuario_id, data.alias, excluir_id=id)

        return await self.repo.actualizar(id, data)

    async def marcar_predeterminada(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        direccion = await self._validar_direccion_del_usuario(id, usuario_id)

        if direccion.es_predeterminada:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Esta dirección ya es la predeterminada"
            )

        await self.repo.desmarcar_predeterminada(usuario_id)
        resultado = await self.repo.marcar_predeterminada(id)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al marcar la dirección como predeterminada"
            )
        
        return resultado

    async def desactivar(
        self, id: PydanticObjectId, usuario_id: PydanticObjectId
    ) -> Direcciones:
        
        direccion = await self._validar_direccion_del_usuario(id, usuario_id)
        resultado = await self.repo.desactivar(id)
        
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al desactivar la dirección"
            )

        if direccion.es_predeterminada:
            restantes, _ = await self.repo.listar_por_usuario(
                usuario_id=usuario_id,
                skip=0,
                limit=1,
                solo_activas=True
            )
            
            if restantes:
                await self.repo.marcar_predeterminada(restantes[0].id)

        return resultado