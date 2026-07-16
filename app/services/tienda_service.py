from fastapi import HTTPException, status
from app.models.tienda_model import ProductoTienda
from app.schemas.tienda_schema import TiendaCreate, TiendaUpdate
from app.models.categoria_tienda_model import CategoriaTienda
from app.repos.tienda_repo import TiendaRepo
from beanie import PydanticObjectId


class TiendaService:
    def __init__(self):
        self.repo = TiendaRepo()

    def _validar_activo(self, producto: ProductoTienda) -> None:
        if not producto.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Esta acción no está permitida para un producto inactivo"
            )


    async def crear(self, data: TiendaCreate) -> ProductoTienda:
        if await self.repo.obtener_por_codigo(data.codigo):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un producto registrado con el codigo '{data.codigo}'"
            )

        categoria = await CategoriaTienda.get(data.categoria)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No existe una categoría con el ID '{data.categoria}'"
            )

        datos = data.model_dump(exclude_unset=True)
        datos["categoria"] = data.categoria
        documento = ProductoTienda(**datos)
        await documento.insert()
        return documento
    
    async def listar(self) -> list[ProductoTienda]:
        return await self.repo.listar()

    async def listar_activos(self) -> list[ProductoTienda]:
        return await self.repo.listar_activos()

    async def obtener_por_id(self, id: PydanticObjectId) -> ProductoTienda:
        producto = await self.repo.obtener_por_id(id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con ID {id} No encontrado"
            )
        return producto

    async def actualizar(self, id: PydanticObjectId, data: TiendaUpdate) -> ProductoTienda:
        producto = await self.obtener_por_id(id)
        self._validar_activo(producto)

        if data.codigo:
            existente = await self.repo.obtener_por_codigo(data.codigo)
            if existente and existente.id != id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un producto con el codigo '{data.codigo}'"
                )

        return await self.repo.actualizar(id, data)

    async def activar(self, id: PydanticObjectId) -> ProductoTienda:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> ProductoTienda:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)