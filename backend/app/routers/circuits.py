from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.circuit import CircuitDetailResponse, CircuitResponse
from app.services.circuits import CircuitService

router = APIRouter(prefix="/circuits", tags=["circuits"])


@router.get("", response_model=list[CircuitResponse])
def get_circuits(
    country: str | None = Query(None, description="Filter circuits by country"),
    limit: int = Query(100, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> list[CircuitResponse]:
    service = CircuitService(db)
    return service.list_circuits(country=country, limit=limit, offset=offset)


@router.get("/{circuit_ref}", response_model=CircuitResponse)
def get_circuit_by_ref(circuit_ref: str, db: Session = Depends(get_db)) -> CircuitResponse:
    service = CircuitService(db)
    circuit = service.get_circuit_by_ref(circuit_ref)
    if not circuit:
        raise HTTPException(status_code=404, detail=f"Circuit '{circuit_ref}' not found")
    return circuit


@router.get("/{circuit_ref}/details", response_model=CircuitDetailResponse)
def get_circuit_details(circuit_ref: str, db: Session = Depends(get_db)) -> CircuitDetailResponse:
    service = CircuitService(db)
    details = service.get_circuit_details(circuit_ref)
    if not details:
        raise HTTPException(status_code=404, detail=f"Circuit '{circuit_ref}' not found")
    return CircuitDetailResponse(**details)
