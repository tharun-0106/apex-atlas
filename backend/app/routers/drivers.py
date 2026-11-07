from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.driver import DriverResponse
from app.services.drivers import DriverService

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.get("", response_model=list[DriverResponse])
def get_drivers(
    nationality: str | None = Query(None, description="Filter drivers by nationality"),
    limit: int = Query(100, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> list[DriverResponse]:
    service = DriverService(db)
    return service.list_drivers(nationality=nationality, limit=limit, offset=offset)


@router.get("/{driver_ref}", response_model=DriverResponse)
def get_driver_by_ref(driver_ref: str, db: Session = Depends(get_db)) -> DriverResponse:
    service = DriverService(db)
    driver = service.get_driver_by_ref(driver_ref)
    if not driver:
        raise HTTPException(status_code=404, detail=f"Driver '{driver_ref}' not found")
    return driver
