from fastapi import HTTPException, status
from beanie import PydanticObjectId
from decimal import Decimal
from src.modules.productos.document import Productos
from src.modules.productos.schema import ProductoCreate, ProductoUpdate
from src.modules.productos.repo import ProductoRepo
from src.modules.categoriasProductos.repo import CategoriaRepo

class ProductoService:
    def __init__(self):
        self.repo = ProductoRepo()
        self.categoria_repo = CategoriaRepo()

    async def _validar_categoria_existe(self, categoria_id: PydanticObjectId) -> None:
        categoria = await self.categoria_repo.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"La categoría con ID '{categoria_id}' no existe"
            )

    async def _validar_slug_unico(
        self, slug: str, excluir_id: PydanticObjectId | None = None
    ) -> None:
        if await self.repo.slug_existe(slug, excluir_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un producto con el slug '{slug}'"
            )

    async def crear(self, data: ProductoCreate) -> Productos:
        await self._validar_categoria_existe(data.categoria_id)
        await self._validar_slug_unico(data.slug)
        documento = Productos(**data.model_dump())
        await documento.insert()
        return documento

    async def listar(self, skip: int = 0, limit: int = 20) -> tuple[list[Productos], int]:
        return await self.repo.listar(skip=skip, limit=limit)

    async def listar_activos(self, skip: int = 0, limit: int = 20) -> tuple[list[Productos], int]:
        return await self.repo.listar_activos(skip=skip, limit=limit)

    async def listar_inactivos(self, skip: int = 0, limit: int = 20) -> tuple[list[Productos], int]:
        return await self.repo.listar_inactivos(skip=skip, limit=limit)

    async def obtener_por_id(self, id: PydanticObjectId) -> Productos:
        producto = await self.repo.obtener_por_id(id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        return producto

    async def obtener_por_slug(self, slug: str) -> Productos:
        slug_limpio = slug.strip('"').strip("'").strip().lower()

        producto = await self.repo.obtener_por_slug(slug_limpio)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Producto con slug '{slug_limpio}' no encontrado"
            )
        return producto

    async def listar_por_categoria(
        self,
        categoria_id: PydanticObjectId,
        skip: int = 0,
        limit: int = 20,
        solo_activos: bool = True,
    ) -> tuple[list[Productos], int]:
        await self._validar_categoria_existe(categoria_id)
        return await self.repo.listar_por_categoria(
            categoria_id=categoria_id,
            skip=skip,
            limit=limit,
            solo_activos=solo_activos,
        )

    async def buscar_por_filtro(
        self,
        nombre: str | None = None,
        categoria_id: PydanticObjectId | None = None,
        precio_min: Decimal | None = None,
        precio_max: Decimal | None = None,
        stock_min: int | None = None,
        solo_activos: bool = True,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Productos], int]:
        if categoria_id:
            await self._validar_categoria_existe(categoria_id)

        return await self.repo.buscar_por_filtro(
            nombre=nombre,
            categoria_id=categoria_id,
            precio_min=precio_min,
            precio_max=precio_max,
            stock_min=stock_min,
            solo_activos=solo_activos,
            skip=skip,
            limit=limit,
        )

    async def obtener_recientes(self, limit: int = 10) -> list[Productos]:
        return await self.repo.obtener_recientes(limit=limit)

    async def actualizar(self, id: PydanticObjectId, data: ProductoUpdate) -> Productos:
        producto = await self.obtener_por_id(id)

        if data.categoria_id is not None:
            await self._validar_categoria_existe(data.categoria_id)

        if data.slug is not None:
            await self._validar_slug_unico(data.slug, excluir_id=id)

        return await self.repo.actualizar(id, data)

    async def actualizar_stock(self, id: PydanticObjectId, delta: int) -> Productos:
        producto = await self.obtener_por_id(id)
        
        nuevo_stock = producto.stock + delta
        if nuevo_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede actualizar el stock. Stock actual: {producto.stock}, delta: {delta}"
            )

        resultado = await self.repo.actualizar_stock(id, delta)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo actualizar el stock"
            )
        return resultado

    async def descontar_stock(self, id: PydanticObjectId, cantidad: int) -> Productos:
        if cantidad <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad a descontar debe ser mayor a 0"
            )

        resultado = await self.repo.descontar_stock(id, cantidad)
        if not resultado:
            producto = await self.repo.obtener_por_id(id)
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado"
                )
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Stock insuficiente. Disponible: {producto.stock}, solicitado: {cantidad}"
            )
        return resultado

    async def establecer_stock(self, id: PydanticObjectId, nuevo_stock: int) -> Productos:
        producto = await self.obtener_por_id(id)
        resultado = await self.repo.establecer_stock(id, nuevo_stock)
        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo establecer el stock"
            )
        return resultado

    async def activar(self, id: PydanticObjectId) -> Productos:
        await self.obtener_por_id(id)
        return await self.repo.activar(id)

    async def desactivar(self, id: PydanticObjectId) -> Productos:
        await self.obtener_por_id(id)
        return await self.repo.desactivar(id)