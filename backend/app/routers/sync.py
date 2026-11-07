from typing import Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.sync import SyncService

router = APIRouter(prefix="/sync", tags=["sync"])


@router.post("", response_model=dict[str, Any])
async def trigger_sync(
    year: int = Query(2024, description="F1 season year to synchronize"),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    service = SyncService(db)
    return await service.sync_season(year)
