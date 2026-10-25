import sys
from typing import Callable
from fastapi import Request

_IN_TEST = "pytest" in sys.modules

def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def _default_key_func(request: Request) -> str:
    return f"ip:{_get_client_ip(request)}"


def _auth_key_func(request: Request) -> str:
    return f"auth:{_get_client_ip(request)}"


def _user_key_func(request: Request) -> str:
    auth = request.headers.get("authorization", "")
    if auth.startswith("Bearer "):
        token_hash = str(hash(auth[7:]))
        return f"user:{token_hash}"
    return _default_key_func(request)


if _IN_TEST:
    class _DummyLimiter:
        def limit(self, *args, **kwargs):
            def decorator(f):
                return f
            return decorator

        def shared_limit(self, *args, **kwargs):
            def decorator(f):
                return f
            return decorator

    limiter = _DummyLimiter()

    def auth_limit(limit_string: str) -> Callable:
        def decorator(f):
            return f
        return decorator

    def registro_limit(limit_string: str) -> Callable:
        def decorator(f):
            return f
        return decorator

    def mensaje_limit(limit_string: str) -> Callable:
        def decorator(f):
            return f
        return decorator

    def upload_limit(limit_string: str) -> Callable:
        def decorator(f):
            return f
        return decorator

    def operacion_sensible_limit(limit_string: str) -> Callable:
        def decorator(f):
            return f
        return decorator

    RATE_LIMIT_ENABLED = False

else:
    from slowapi import Limiter

    limiter = Limiter(
        key_func=_default_key_func,
        storage_uri="memory://",
        default_limits=["200/minute"],
        headers_enabled=True,
        strategy="moving-window",
    )

    def auth_limit(limit_string: str) -> Callable:
        return limiter.limit(limit_string, key_func=_auth_key_func)

    def registro_limit(limit_string: str = "3/hour") -> Callable:
        return limiter.limit(limit_string, key_func=_default_key_func)

    def mensaje_limit(limit_string: str = "30/minute") -> Callable:
        return limiter.limit(limit_string, key_func=_user_key_func)

    def upload_limit(limit_string: str = "20/minute") -> Callable:
        return limiter.limit(limit_string, key_func=_user_key_func)

    def operacion_sensible_limit(limit_string: str = "5/hour") -> Callable:
        return limiter.limit(limit_string, key_func=_user_key_func)

    RATE_LIMIT_ENABLED = True