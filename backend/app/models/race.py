from datetime import date, time
from typing import TYPE_CHECKING
from sqlalchemy import Date, ForeignKey, Integer, String, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.circuit import Circuit
    from app.models.result import Result
    from app.models.season import Season


class Race(Base):
    __tablename__ = "races"
    __table_args__ = (
        UniqueConstraint("season_year", "round", name="uq_race_season_round"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    season_year: Mapped[int] = mapped_column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), index=True, nullable=False)
    round: Mapped[int] = mapped_column(Integer, nullable=False)
    circuit_id: Mapped[int] = mapped_column(Integer, ForeignKey("circuits.id", ondelete="RESTRICT"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    time: Mapped[time | None] = mapped_column(Time, nullable=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    season: Mapped["Season"] = relationship("Season", back_populates="races")
    circuit: Mapped["Circuit"] = relationship("Circuit", back_populates="races")
    results: Mapped[list["Result"]] = relationship("Result", back_populates="race", cascade="all, delete-orphan")
