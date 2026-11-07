from sqlalchemy.orm import Session

from app.models.race import Race
from app.models.result import Result
from app.repositories.races import RaceRepository
from app.repositories.results import ResultRepository


class RaceService:
    def __init__(self, db: Session) -> None:
        self.race_repo = RaceRepository(db)
        self.result_repo = ResultRepository(db)

    def list_races_by_season(self, season_year: int) -> list[Race]:
        return self.race_repo.list_by_season(season_year)

    def get_race(self, race_id: int) -> Race | None:
        return self.race_repo.get_by_id(race_id)

    def get_upcoming_race(self, season_year: int | None = None) -> Race | None:
        return self.race_repo.get_upcoming(season_year)

    def get_latest_completed_race(self, season_year: int | None = None) -> tuple[Race | None, list[Result]]:
        race = self.race_repo.get_latest_completed(season_year)
        if not race:
            return None, []
        results = self.result_repo.list_by_race(race.id)
        return race, results

    def get_race_results(self, race_id: int) -> list[Result]:
        return self.result_repo.list_by_race(race_id)
