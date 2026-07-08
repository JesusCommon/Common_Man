from fastapi import Request
from fastapi.responses import JSONResponse
from loguru import logger

class AppException(Exception):
    def __init__(self, status_code: int, detail: str, code: str) -> None:
        self.status_code = status_code
        self.detail = detail
        self.code = code

class NotFoundException(AppException):
    def __init__(self, detail: str="Recurso no encontrado") -> None:
        super().__init__(status_code=404, detail=detail, code="NOT_FOUND")

class BadRequestException(AppException):
    def __init__(self, detail: str="Peticion mal formulada") -> None:
        super().__init__(status_code=400, detail=detail, code="BAD_REQUEST")

class UnauthorizedException(AppException):
    def __init__(self, detail: str="No Autenticado") -> None:
        super().__init__(status_code=401, detail=detail, code="UNAUTHORIZED")

class ForbiddenException(AppException):
    def __init__(self, detail: str="Sin permiso") -> None:
        super().__init__(status_code=403, detail=detail, code="FORBIDDEN")

class ConflictException(AppException):
    def __init__(self, detail: str="Conflicto") -> None:
        super().__init__(status_code=409, detail=detail, code="CONFLICT")

class InternalServerException(AppException):
    def __init__(self, detail: str="Error interno del servidor") -> None:
        super().__init__(status_code=500, detail=detail, code="INTERNAL_SERVER_ERROR")

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning(f"{exc.code} {exc.status_code} -- {request.method} {request.url} -- {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error":{
                "code": exc.code,
                "detail": exc.detail
            }
        }
    )

async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhendled Expeption -- {request.method} {request.url} -- {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error":{
                "code": "INTERNAL_SERVER_ERROR",
                "detail": "Un error inesperado ocurrido"
            }
        }
    )

