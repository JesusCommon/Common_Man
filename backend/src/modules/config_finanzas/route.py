from fastapi import APIRouter, Depends, Query
from src.core.security.jwt import obtener_usuario_admin
from src.modules.config_finanzas.document import ConfiguracionSistema
from src.modules.pagos.document import MovimientoSaldo, TipoMovimientoEnum, EstadoMovimientoEnum
from src.modules.config_finanzas.schema import WalletResponse, HistorialItemResponse
from src.shared.common_schema import Paginado

router = APIRouter(prefix="/admin/finanzas", tags=["Finanzas"])

MAX_LIMIT = 100

@router.get(
    "/wallet",
    response_model=WalletResponse,
    dependencies=[Depends(obtener_usuario_admin)],
)
async def obtener_wallet():
    config = await ConfiguracionSistema.find_one()

    if not config:
        config = ConfiguracionSistema()
        await config.insert()

    return config


@router.get(
    "/historial",
    response_model=Paginado[HistorialItemResponse],
    dependencies=[Depends(obtener_usuario_admin)],
)
async def listar_historial_financiero(
    tipo: TipoMovimientoEnum | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    limit = min(limit, MAX_LIMIT)

    query_dict = {
        "estado": EstadoMovimientoEnum.EXITOSO,
    }

    if tipo:
        query_dict["tipo"] = tipo

    query = MovimientoSaldo.find(query_dict)
    total = await query.count()

    movimientos = (
        await query
        .sort(-MovimientoSaldo.fecha_creacion)
        .skip(skip)
        .limit(limit)
        .to_list()
    )

    return Paginado(items=movimientos, total=total, skip=skip, limit=limit)