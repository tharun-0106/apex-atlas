from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.circuit import Circuit
from app.models.constructor import Constructor
from app.models.driver import Driver
from app.models.race import Race
from app.models.result import Result


class CircuitRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert(self, data: dict) -> Circuit:
        stmt = insert(Circuit).values(**data)
        stmt = stmt.on_conflict_do_update(
            index_elements=[Circuit.circuit_ref],
            set_={
                "name": stmt.excluded.name,
                "location": stmt.excluded.location,
                "country": stmt.excluded.country,
                "latitude": stmt.excluded.latitude,
                "longitude": stmt.excluded.longitude,
                "url": stmt.excluded.url,
            },
        ).returning(Circuit)
        return self.db.execute(stmt).scalar_one()

    def get_by_ref(self, ref: str) -> Circuit | None:
        return self.db.execute(select(Circuit).where(Circuit.circuit_ref == ref)).scalar_one_or_none()

    def get_by_id(self, circuit_id: int) -> Circuit | None:
        return self.db.execute(select(Circuit).where(Circuit.id == circuit_id)).scalar_one_or_none()

    def list_all(self, country: str | None = None, limit: int = 100, offset: int = 0) -> list[Circuit]:
        stmt = select(Circuit)
        if country:
            stmt = stmt.where(Circuit.country.ilike(f"%{country}%"))
        stmt = stmt.order_by(Circuit.name).limit(limit).offset(offset)
        return list(self.db.execute(stmt).scalars().all())

    def count(self, country: str | None = None) -> int:
        from sqlalchemy import func
        stmt = select(func.count(Circuit.id))
        if country:
            stmt = stmt.where(Circuit.country.ilike(f"%{country}%"))
        return self.db.execute(stmt).scalar() or 0

    def get_races_at_circuit(self, circuit_id: int) -> list[dict]:
        stmt = (
            select(
                Race.id,
                Race.season_year,
                Race.round,
                Race.name,
                Race.date,
                Driver.forename.label("winner_forename"),
                Driver.surname.label("winner_surname"),
                Driver.driver_ref.label("winner_driver_ref"),
                Driver.code.label("winner_code"),
                Constructor.name.label("winner_constructor_name"),
                Constructor.constructor_ref.label("winner_constructor_ref"),
                Result.time_text.label("winner_time"),
            )
            .select_from(Race)
            .outerjoin(Result, (Result.race_id == Race.id) & (Result.position == 1))
            .outerjoin(Driver, Result.driver_id == Driver.id)
            .outerjoin(Constructor, Result.constructor_id == Constructor.id)
            .where(Race.circuit_id == circuit_id)
            .order_by(Race.season_year.desc(), Race.round.desc())
        )
        rows = self.db.execute(stmt).all()
        return [
            {
                "race_id": r.id,
                "season_year": r.season_year,
                "round": r.round,
                "name": r.name,
                "date": str(r.date),
                "winner_driver": f"{r.winner_forename} {r.winner_surname}" if r.winner_forename else None,
                "winner_driver_ref": r.winner_driver_ref,
                "winner_code": r.winner_code,
                "winner_constructor": r.winner_constructor_name,
                "winner_constructor_ref": r.winner_constructor_ref,
                "winner_time": r.winner_time,
            }
            for r in rows
        ]
