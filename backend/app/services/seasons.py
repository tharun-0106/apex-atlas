from sqlalchemy.orm import Session

from app.repositories.seasons import SeasonRepository


class SeasonService:
    def __init__(self, db: Session) -> None:
        self.repo = SeasonRepository(db)

    def list_seasons(self) -> list[int]:
        years = self.repo.list_all_years()
        if not years:
            return [2026]
        return years

    def get_summary(self, year: int | None = None) -> dict:
        target_year = year or self.repo.get_latest_season_year() or 2026
        return self.repo.get_summary(target_year)
