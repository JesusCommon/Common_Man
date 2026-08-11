import os
from fastapi.middleware.cors import CORSMiddleware


def setup_cors(app) -> None:
    env = os.getenv("APP_ENVIRONMENT", "development").lower()

    if env == "test":
        return

    if env == "production":
        origins = _parse_origins(os.getenv("CORS_ALLOWED_ORIGINS", ""))
        allow_credentials = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
    else:
        origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4321",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:4321",
        ]
        allow_credentials = True

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
        expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining"],
        max_age=600,
    )


def _parse_origins(raw: str) -> list[str]:
    return [o.strip() for o in raw.split(",") if o.strip()]