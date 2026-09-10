from fastapi import WebSocket, WebSocketException, status
from src.core.security.jwt import decodificar
from src.modules.usuarios.document import Usuario
from uuid import UUID

async def get_current_user_ws(websocket: WebSocket) -> Usuario:
    token = websocket.query_params.get("token")
    if not token:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Token requerido")

    payload = decodificar(token)
    if payload is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Token inválido")

    if payload.get("type") != "access":
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Token inválido")

    try:
        identificador = UUID(payload["sub"])
    except Exception:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Token inválido")

    usuario = await Usuario.find_one(Usuario.identificador == identificador)
    if not usuario or not usuario.activo:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Usuario inválido")

    return usuario