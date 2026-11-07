from pydantic import BaseModel, ConfigDict

from app.schemas.constructor import ConstructorResponse
from app.schemas.driver import DriverResponse
from app.schemas.race import RaceResponse


class ResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    number: int | None = None
    grid: int | None = None
    position: int | None = None
    position_text: str | None = None
    points: float
    laps: int
    status: str | None = None
    time_text: str | None = None
    time_millis: int | None = None
    fastest_lap_rank: int | None = None
    fastest_lap_time: str | None = None
    driver: DriverResponse | None = None
    constructor: ConstructorResponse | None = None


class RaceWithResultsResponse(BaseModel):
    race: RaceResponse
    results: list[ResultResponse]
