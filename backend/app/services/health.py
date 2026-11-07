import logging

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.schemas.health import HealthResponse

logger = logging.getLogger(__name__)


def check_health(db: Session | None, settings: Settings) -> HealthResponse:
    """Report API status and database connectivity without raising."""
    database = "down"
    if db is not None:
        try:
            db.execute(text("SELECT 1"))
            database = "up"
        except Exception as exc:  # noqa: BLE001 - health check must never raise
            logger.warning("Database health check failed: %s", exc)
    return HealthResponse(
        status="ok" if database == "up" else "degraded",
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        database=database,
    )
