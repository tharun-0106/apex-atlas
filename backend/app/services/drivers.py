from sqlalchemy.orm import Session

from app.models.driver import Driver
from app.repositories.drivers import DriverRepository


class DriverService:
    def __init__(self, db: Session) -> None:
        self.repo = DriverRepository(db)

    def get_driver_by_ref(self, ref: str) -> Driver | None:
        return self.repo.get_by_ref(ref)

    def list_drivers(self, nationality: str | None = None, limit: int = 100, offset: int = 0) -> list[Driver]:
        return self.repo.list_all(nationality=nationality, limit=limit, offset=offset)
