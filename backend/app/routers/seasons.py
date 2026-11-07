from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.season import SeasonSummaryResponse
from app.services.seasons import SeasonService

router = APIRouter(prefix="/seasons", tags=["seasons"])


@router.get("", response_model=list[int])
def list_seasons(db: Session = Depends(get_db)) -> list[int]:
    service = SeasonService(db)
    return service.list_seasons()


@router.get("/summary", response_model=SeasonSummaryResponse)
def get_season_summary(
    year: int | None = Query(None, description="Season year (defaults to latest)"),
    db: Session = Depends(get_db),
) -> SeasonSummaryResponse:
    service = SeasonService(db)
    summary = service.get_summary(year)
    return SeasonSummaryResponse(**summary)
