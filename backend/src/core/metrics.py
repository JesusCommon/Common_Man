from prometheus_fastapi_instrumentator import Instrumentator


def setup_metrics(app) -> None:
    """
    Configura el instrumentador de Prometheus sobre la app FastAPI.
    Métricas incluidas por defecto:
      - http_requests_total        (contador por método, endpoint, status)
      - http_request_duration_seconds (histograma de latencia)
      - http_request_size_bytes
      - http_response_size_bytes
    """
    Instrumentator().instrument(app).expose(
        app,
        endpoint="/metrics",
        include_in_schema=False,
        tags=["Monitoring"],
    )