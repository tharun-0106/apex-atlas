from typing import TYPE_CHECKING
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.race import Race
    from app.models.standing import ConstructorStanding, DriverStanding


class Season(Base):
    __tablename__ = "seasons"

    year: Mapped[int] = mapped_column(Integer, primary_key=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    races: Mapped[list["Race"]] = relationship("Race", back_populates="season", cascade="all, delete-orphan")
    driver_standings: Mapped[list["DriverStanding"]] = relationship(
        "DriverStanding", back_populates="season", cascade="all, delete-orphan"
    )
    constructor_standings: Mapped[list["ConstructorStanding"]] = relationship(
        "ConstructorStanding", back_populates="season", cascade="all, delete-orphan"
    )
