from pydantic import BaseModel


class SeasonSummaryResponse(BaseModel):
    year: int
    total_races: int
    completed_races: int
    total_drivers: int
    total_constructors: int
