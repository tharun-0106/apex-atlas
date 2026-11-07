from sqlalchemy.orm import Session

from app.models.circuit import Circuit
from app.repositories.circuits import CircuitRepository


class CircuitService:
    def __init__(self, db: Session) -> None:
        self.repo = CircuitRepository(db)

    def get_circuit_by_ref(self, ref: str) -> Circuit | None:
        return self.repo.get_by_ref(ref)

    def list_circuits(self, country: str | None = None, limit: int = 100, offset: int = 0) -> list[Circuit]:
        return self.repo.list_all(country=country, limit=limit, offset=offset)
