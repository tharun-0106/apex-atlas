from pydantic import BaseModel, ConfigDict


class ConstructorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    constructor_ref: str
    name: str
    nationality: str | None = None
    url: str | None = None
