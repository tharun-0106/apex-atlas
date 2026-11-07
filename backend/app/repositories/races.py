from datetime import date
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session, joinedload

from app.models.race import Race
from app.models.result import Result


class RaceRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert(self, data: dict) -> Race:
        stmt = insert(Race).values(**data)
        stmt = stmt.on_conflict_do_update(
            constraint="uq_race_season_round",
            set_={
                "circuit_id": stmt.excluded.circuit_id,
                "name": stmt.excluded.name,
                "date": stmt.excluded.date,
                "time": stmt.excluded.time,
                "url": stmt.excluded.url,
            },
        ).returning(Race)
        return self.db.execute(stmt).scalar_one()

    def get_by_id(self, race_id: int) -> Race | None:
        stmt = (
            select(Race)
            .options(joinedload(Race.circuit), joinedload(Race.season))
            .where(Race.id == race_id)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def get_by_season_and_round(self, season_year: int, round_number: int) -> Race | None:
        stmt = (
            select(Race)
            .options(joinedload(Race.circuit))
            .where(Race.season_year == season_year, Race.round == round_number)
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def list_by_season(self, season_year: int) -> list[Race]:
        stmt = (
            select(Race)
            .options(joinedload(Race.circuit))
            .where(Race.season_year == season_year)
            .order_by(Race.round)
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_upcoming(self, season_year: int | None = None) -> Race | None:
        today = date.today()
        stmt = (
            select(Race)
            .options(joinedload(Race.circuit))
            .where(Race.date >= today)
        )
        if season_year:
            stmt = stmt.where(Race.season_year == season_year)
        stmt = stmt.order_by(Race.date.asc()).limit(1)
        res = self.db.execute(stmt).scalar_one_or_none()
        if not res:
            stmt_last = select(Race).options(joinedload(Race.circuit))
            if season_year:
                stmt_last = stmt_last.where(Race.season_year == season_year)
            stmt_last = stmt_last.order_by(Race.date.desc(), Race.round.desc()).limit(1)
            return self.db.execute(stmt_last).scalar_one_or_none()
        return res

    def get_latest_completed(self, season_year: int | None = None) -> Race | None:
        subquery = select(Result.race_id).distinct()
        stmt = (
            select(Race)
            .options(joinedload(Race.circuit))
            .where(Race.id.in_(subquery))
        )
        if season_year:
            stmt = stmt.where(Race.season_year == season_year)
        stmt = stmt.order_by(Race.date.desc(), Race.round.desc()).limit(1)
        return self.db.execute(stmt).scalar_one_or_none()
