from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.constructor import Constructor
from app.models.driver import Driver
from app.models.race import Race
from app.models.result import Result
from app.models.season import Season


class SeasonRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert(self, year: int, url: str | None = None) -> Season:
        stmt = insert(Season).values(year=year, url=url)
        stmt = stmt.on_conflict_do_update(
            index_elements=[Season.year],
            set_={"url": stmt.excluded.url},
        ).returning(Season)
        return self.db.execute(stmt).scalar_one()

    def get_latest_season_year(self) -> int | None:
        return self.db.execute(select(func.max(Season.year))).scalar()

    def list_all_years(self) -> list[int]:
        stmt = select(Season.year).order_by(Season.year.desc())
        return list(self.db.execute(stmt).scalars().all())

    def get_summary(self, year: int) -> dict:
        total_races = self.db.execute(
            select(func.count(Race.id)).where(Race.season_year == year)
        ).scalar() or 0

        completed_races = self.db.execute(
            select(func.count(func.distinct(Result.race_id)))
            .select_from(Result)
            .join(Race, Result.race_id == Race.id)
            .where(Race.season_year == year)
        ).scalar() or 0

        total_drivers = self.db.execute(
            select(func.count(func.distinct(Result.driver_id)))
            .select_from(Result)
            .join(Race, Result.race_id == Race.id)
            .where(Race.season_year == year)
        ).scalar() or 0

        total_constructors = self.db.execute(
            select(func.count(func.distinct(Result.constructor_id)))
            .select_from(Result)
            .join(Race, Result.race_id == Race.id)
            .where(Race.season_year == year)
        ).scalar() or 0

        return {
            "year": year,
            "total_races": total_races,
            "completed_races": completed_races,
            "total_drivers": total_drivers,
            "total_constructors": total_constructors,
        }
