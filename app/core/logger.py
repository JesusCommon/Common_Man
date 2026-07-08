import sys
from loguru import logger

def setup_logging(environment: str, debug: bool) -> None:
    logger.remove()

    level = "DEBUG" if debug else "INFO"

    logger.add(
        sys.stdout,
        level=level,
        colorize=True,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> |"
            "<level>{level: < 8}</level> |"
            "<cyan>{name}</cyan>:<cyan>{line}</cyan> |"
            "<level>{message}</level>"
        ),
    )

    if environment == "production":
        logger.add(
            "logs/app.log",
            level="INFO",
            rotation="10MB",
            retention="30 days",
            compression="zip",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level < 8} | {name}:{line} | {message}",
        )

    logger.info(f"Logging initialized - level: {level} | environment: {environment}")
    