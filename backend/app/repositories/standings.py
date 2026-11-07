from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session, joinedload

from app.models.standing import ConstructorStanding, DriverStanding


class StandingsRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert_driver_standing(self, data: dict) -> DriverStanding:
        stmt = insert(DriverStanding).values(**data)
        stmt = stmt.on_conflict_do_update(
            constraint="uq_driver_standing_season_driver_round",
            set_={
                "points": stmt.excluded.points,
                "position": stmt.excluded.position,
                "position_text": stmt.excluded.position_text,
                "wins": stmt.excluded.wins,
            },
        ).returning(DriverStanding)
        return self.db.execute(stmt).scalar_one()

    def upsert_constructor_standing(self, data: dict) -> ConstructorStanding:
        stmt = insert(ConstructorStanding).values(**data)
        stmt = stmt.on_conflict_do_update(
            constraint="uq_constructor_standing_season_constructor_round",
            set_={
                "points": stmt.excluded.points,
                "position": stmt.excluded.position,
                "position_text": stmt.excluded.position_text,
                "wins": stmt.excluded.wins,
            },
        ).returning(ConstructorStanding)
        return self.db.execute(stmt).scalar_one()

    def list_driver_standings(self, season_year: int, round_number: int = 0, limit: int = 50) -> list[DriverStanding]:
        stmt = (
            select(DriverStanding)
            .options(joinedload(DriverStanding.driver))
            .where(DriverStanding.season_year == season_year, DriverStanding.round == round_number)
            .order_by(DriverStanding.position.asc())
            .limit(limit)
        )
        return list(self.db.execute(stmt).scalars().all())

    def list_constructor_standings(self, season_year: int, round_number: int = 0, limit: int = 20) -> list[ConstructorStanding]:
        stmt = (
            select(ConstructorStanding)
            .options(joinedload(ConstructorStanding.constructor))
            .where(ConstructorStanding.season_year == season_year, ConstructorStanding.round == round_number)
            .order_by(ConstructorStanding.position.asc())
            .limit(limit)
        )
        return list(self.db.execute(stmt).scalars().all())
