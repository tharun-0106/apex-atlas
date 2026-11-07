from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.constructor import Constructor


class ConstructorRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert(self, data: dict) -> Constructor:
        stmt = insert(Constructor).values(**data)
        stmt = stmt.on_conflict_do_update(
            index_elements=[Constructor.constructor_ref],
            set_={
                "name": stmt.excluded.name,
                "nationality": stmt.excluded.nationality,
                "url": stmt.excluded.url,
            },
        ).returning(Constructor)
        return self.db.execute(stmt).scalar_one()

    def get_by_ref(self, ref: str) -> Constructor | None:
        return self.db.execute(select(Constructor).where(Constructor.constructor_ref == ref)).scalar_one_or_none()

    def get_by_id(self, constructor_id: int) -> Constructor | None:
        return self.db.execute(select(Constructor).where(Constructor.id == constructor_id)).scalar_one_or_none()

    def list_all(self, limit: int = 100, offset: int = 0) -> list[Constructor]:
        stmt = select(Constructor).order_by(Constructor.name).limit(limit).offset(offset)
        return list(self.db.execute(stmt).scalars().all())

    def count(self) -> int:
        stmt = select(func.count(Constructor.id))
        return self.db.execute(stmt).scalar() or 0
