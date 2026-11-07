from pydantic import BaseModel, ConfigDict

from app.schemas.constructor import ConstructorResponse
from app.schemas.driver import DriverResponse


class DriverStandingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    position_text: str | None = None
    points: float
    wins: int
    driver: DriverResponse


class ConstructorStandingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position: int
    position_text: str | None = None
    points: float
    wins: int
    constructor: ConstructorResponse
