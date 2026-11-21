from pydantic import BaseModel, ConfigDict


class CircuitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    circuit_ref: str
    name: str
    location: str | None = None
    country: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    url: str | None = None


class CircuitRaceHistoryItem(BaseModel):
    race_id: int
    season_year: int
    round: int
    name: str
    date: str
    winner_driver: str | None = None
    winner_driver_ref: str | None = None
    winner_code: str | None = None
    winner_constructor: str | None = None
    winner_constructor_ref: str | None = None
    winner_time: str | None = None


class CircuitDetailResponse(BaseModel):
    circuit: CircuitResponse
    races: list[CircuitRaceHistoryItem]
    total_races: int
