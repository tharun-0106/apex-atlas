from datetime import date
from typing import TYPE_CHECKING
from sqlalchemy import Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.result import Result
    from app.models.standing import DriverStanding


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    driver_ref: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    code: Mapped[str | None] = mapped_column(String(8), index=True, nullable=True)
    permanent_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    forename: Mapped[str] = mapped_column(String(64), nullable=False)
    surname: Mapped[str] = mapped_column(String(64), nullable=False)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(64), nullable=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    results: Mapped[list["Result"]] = relationship("Result", back_populates="driver")
    standings: Mapped[list["DriverStanding"]] = relationship("DriverStanding", back_populates="driver")
