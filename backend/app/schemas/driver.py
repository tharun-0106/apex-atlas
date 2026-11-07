from datetime import date
from pydantic import BaseModel, ConfigDict


class DriverResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    driver_ref: str
    code: str | None = None
    permanent_number: int | None = None
    forename: str
    surname: str
    date_of_birth: date | None = None
    nationality: str | None = None
    url: str | None = None
