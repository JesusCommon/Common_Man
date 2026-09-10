from fastapi import WebSocket, WebSocketException, status
from beanie import PydanticObjectId
from src.core.security.jwt import decodificar
from src.modules.usuarios.document import Usuario

async def get_current_user_ws(websocket: WebSocket) -> Usuario:
    token = websocket.query_params.get("token")
    
    if not token:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, 
            reason="Token no proporcionado"
        )

    payload = decodificar(token)
    
    if payload is None:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, 
            reason="Token inválido o expirado"
        )

    if payload.get("type") != "access":
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, 
            reason="Se requiere un access token"
        )

    try:
        identificador = PydanticObjectId(payload["sub"])
    except Exception:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, 
            reason="Token inválido"
        )
    
    usuario = await Usuario.find_one(Usuario.identificador == identificador)

    if usuario is None or not usuario.activo:
        raise WebSocketException(
            code=status.WS_1008_POLICY_VIOLATION, 
            reason="Usuario no válido"
        )

    return usuario