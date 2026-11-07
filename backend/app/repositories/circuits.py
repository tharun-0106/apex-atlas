from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.circuit import Circuit


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
