from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session, joinedload

from app.models.result import Result


class ResultRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert(self, data: dict) -> Result:
        stmt = insert(Result).values(**data)
        stmt = stmt.on_conflict_do_update(
            constraint="uq_result_race_driver",
            set_={
                "constructor_id": stmt.excluded.constructor_id,
                "number": stmt.excluded.number,
                "grid": stmt.excluded.grid,
                "position": stmt.excluded.position,
                "position_text": stmt.excluded.position_text,
                "points": stmt.excluded.points,
                "laps": stmt.excluded.laps,
                "status": stmt.excluded.status,
                "time_text": stmt.excluded.time_text,
                "time_millis": stmt.excluded.time_millis,
                "fastest_lap_rank": stmt.excluded.fastest_lap_rank,
                "fastest_lap_time": stmt.excluded.fastest_lap_time,
            },
        ).returning(Result)
        return self.db.execute(stmt).scalar_one()

    def list_by_race(self, race_id: int) -> list[Result]:
        stmt = (
            select(Result)
            .options(joinedload(Result.driver), joinedload(Result.constructor))
            .where(Result.race_id == race_id)
            .order_by(Result.position.asc().nulls_last(), Result.grid.asc().nulls_last())
        )
        return list(self.db.execute(stmt).scalars().all())

    def list_podium_by_race(self, race_id: int) -> list[Result]:
        stmt = (
            select(Result)
            .options(joinedload(Result.driver), joinedload(Result.constructor))
            .where(Result.race_id == race_id, Result.position.in_([1, 2, 3]))
            .order_by(Result.position.asc())
        )
        return list(self.db.execute(stmt).scalars().all())
