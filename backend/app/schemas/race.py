from __future__ import annotations
import datetime as dt
from pydantic import BaseModel, ConfigDict

from app.schemas.circuit import CircuitResponse


class RaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    season_year: int
    round: int
    name: str
    date: dt.date
    time: dt.time | None = None
    url: str | None = None
    circuit: CircuitResponse | None = None
