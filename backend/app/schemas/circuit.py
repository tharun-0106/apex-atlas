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
