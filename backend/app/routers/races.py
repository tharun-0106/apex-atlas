from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.race import RaceResponse
from app.schemas.result import RaceWithResultsResponse, ResultResponse
from app.services.races import RaceService
from app.services.seasons import SeasonService

router = APIRouter(prefix="/races", tags=["races"])


@router.get("", response_model=list[RaceResponse])
def get_races(
    year: int | None = Query(None, description="Season year (defaults to latest)"),
    db: Session = Depends(get_db),
) -> list[RaceResponse]:
    target_year = year or SeasonService(db).get_summary()["year"]
    service = RaceService(db)
    return service.list_races_by_season(target_year)


@router.get("/upcoming", response_model=RaceResponse | None)
def get_upcoming_race(
    year: int | None = Query(None, description="Filter for upcoming race in specific season"),
    db: Session = Depends(get_db),
) -> RaceResponse | None:
    service = RaceService(db)
    race = service.get_upcoming_race(year)
    return race


@router.get("/latest-completed", response_model=RaceWithResultsResponse | None)
def get_latest_completed_race(
    year: int | None = Query(None, description="Season year filter"),
    db: Session = Depends(get_db),
) -> RaceWithResultsResponse | None:
    service = RaceService(db)
    race, results = service.get_latest_completed_race(year)
    if not race:
        return None
    return RaceWithResultsResponse(race=race, results=results)


@router.get("/{race_id}", response_model=RaceResponse)
def get_race_by_id(race_id: int, db: Session = Depends(get_db)) -> RaceResponse:
    service = RaceService(db)
    race = service.get_race(race_id)
    if not race:
        raise HTTPException(status_code=404, detail=f"Race with id {race_id} not found")
    return race


@router.get("/{race_id}/results", response_model=list[ResultResponse])
def get_race_results(race_id: int, db: Session = Depends(get_db)) -> list[ResultResponse]:
    service = RaceService(db)
    race = service.get_race(race_id)
    if not race:
        raise HTTPException(status_code=404, detail=f"Race with id {race_id} not found")
    return service.get_race_results(race_id)
