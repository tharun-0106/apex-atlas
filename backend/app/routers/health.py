import logging
from collections.abc import Generator

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_session_factory
from app.schemas.health import HealthResponse
from app.services.health import check_health

logger = logging.getLogger(__name__)
router = APIRouter(tags=["health"])


def get_optional_db() -> Generator[Session | None, None, None]:
    """Yield a session, or None if one cannot be constructed, so /health never 500s."""
    try:
        db = get_session_factory()()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not create DB session: %s", exc)
        yield None
        return
    try:
        yield db
    finally:
        db.close()


@router.get("/health", response_model=HealthResponse)
def health(
    db: Session | None = Depends(get_optional_db),
    settings: Settings = Depends(get_settings),
) -> HealthResponse:
    return check_health(db, settings)
