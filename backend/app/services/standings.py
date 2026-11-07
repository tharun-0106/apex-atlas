from sqlalchemy.orm import Session

from app.models.standing import ConstructorStanding, DriverStanding
from app.repositories.standings import StandingsRepository


class StandingsService:
    def __init__(self, db: Session) -> None:
        self.repo = StandingsRepository(db)

    def get_driver_standings(self, season_year: int, round_number: int = 0, limit: int = 50) -> list[DriverStanding]:
        return self.repo.list_driver_standings(season_year=season_year, round_number=round_number, limit=limit)

    def get_constructor_standings(self, season_year: int, round_number: int = 0, limit: int = 20) -> list[ConstructorStanding]:
        return self.repo.list_constructor_standings(season_year=season_year, round_number=round_number, limit=limit)
