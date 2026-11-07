from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.standing import ConstructorStandingResponse, DriverStandingResponse
from app.services.seasons import SeasonService
from app.services.standings import StandingsService

router = APIRouter(prefix="/standings", tags=["standings"])


@router.get("/drivers", response_model=list[DriverStandingResponse])
def get_driver_standings(
    year: int | None = Query(None, description="Season year (defaults to latest)"),
    round: int = Query(0, description="Round number (0 for final/current standings)"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[DriverStandingResponse]:
    target_year = year or SeasonService(db).get_summary()["year"]
    service = StandingsService(db)
    return service.get_driver_standings(season_year=target_year, round_number=round, limit=limit)


@router.get("/constructors", response_model=list[ConstructorStandingResponse])
def get_constructor_standings(
    year: int | None = Query(None, description="Season year (defaults to latest)"),
    round: int = Query(0, description="Round number (0 for final/current standings)"),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
) -> list[ConstructorStandingResponse]:
    target_year = year or SeasonService(db).get_summary()["year"]
    service = StandingsService(db)
    return service.get_constructor_standings(season_year=target_year, round_number=round, limit=limit)
