from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.driver import Driver


class DriverRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert(self, data: dict) -> Driver:
        stmt = insert(Driver).values(**data)
        stmt = stmt.on_conflict_do_update(
            index_elements=[Driver.driver_ref],
            set_={
                "code": stmt.excluded.code,
                "permanent_number": stmt.excluded.permanent_number,
                "forename": stmt.excluded.forename,
                "surname": stmt.excluded.surname,
                "date_of_birth": stmt.excluded.date_of_birth,
                "nationality": stmt.excluded.nationality,
                "url": stmt.excluded.url,
            },
        ).returning(Driver)
        return self.db.execute(stmt).scalar_one()

    def get_by_ref(self, ref: str) -> Driver | None:
        return self.db.execute(select(Driver).where(Driver.driver_ref == ref)).scalar_one_or_none()

    def get_by_id(self, driver_id: int) -> Driver | None:
        return self.db.execute(select(Driver).where(Driver.id == driver_id)).scalar_one_or_none()

    def list_all(self, nationality: str | None = None, limit: int = 100, offset: int = 0) -> list[Driver]:
        stmt = select(Driver)
        if nationality:
            stmt = stmt.where(Driver.nationality.ilike(f"%{nationality}%"))
        stmt = stmt.order_by(Driver.surname, Driver.forename).limit(limit).offset(offset)
        return list(self.db.execute(stmt).scalars().all())

    def count(self, nationality: str | None = None) -> int:
        stmt = select(func.count(Driver.id))
        if nationality:
            stmt = stmt.where(Driver.nationality.ilike(f"%{nationality}%"))
        return self.db.execute(stmt).scalar() or 0
