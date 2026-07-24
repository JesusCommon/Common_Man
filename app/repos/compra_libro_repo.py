from app.models.compra_libro_model import CompraLibro
from beanie import PydanticObjectId

class CompraLibroRepo:
    async def existe_compra(self, usuario_id: PydanticObjectId, libro_id: PydanticObjectId) -> bool:
        doc = await CompraLibro.find_one(
            CompraLibro.usuario.id == usuario_id,
            CompraLibro.libro.id == libro_id
        )
        return doc is not None

    async def crear(self, usuario_id: PydanticObjectId, libro_id: PydanticObjectId, precio_pagado: float) -> CompraLibro:
        documento = CompraLibro(
            usuario=usuario_id,
            libro=libro_id,
            precio_pagado=precio_pagado
        )
        await documento.insert()
        return documento

    async def listar_por_usuario(self, usuario_id: PydanticObjectId) -> list[CompraLibro]:
        return await CompraLibro.find(
            CompraLibro.usuario.id == usuario_id
        ).to_list()

    async def obtener_por_id(self, id: PydanticObjectId) -> CompraLibro | None:
        return await CompraLibro.get(id)