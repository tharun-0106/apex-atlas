from typing import TYPE_CHECKING
from sqlalchemy import Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.constructor import Constructor
    from app.models.driver import Driver
    from app.models.race import Race


class Result(Base):
    __tablename__ = "results"
    __table_args__ = (
        UniqueConstraint("race_id", "driver_id", name="uq_result_race_driver"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    race_id: Mapped[int] = mapped_column(Integer, ForeignKey("races.id", ondelete="CASCADE"), index=True, nullable=False)
    driver_id: Mapped[int] = mapped_column(Integer, ForeignKey("drivers.id", ondelete="RESTRICT"), index=True, nullable=False)
    constructor_id: Mapped[int] = mapped_column(Integer, ForeignKey("constructors.id", ondelete="RESTRICT"), index=True, nullable=False)
    number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    grid: Mapped[int | None] = mapped_column(Integer, nullable=True)
    position: Mapped[int | None] = mapped_column(Integer, nullable=True)
    position_text: Mapped[str | None] = mapped_column(String(16), nullable=True)
    points: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    laps: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str | None] = mapped_column(String(64), nullable=True)
    time_text: Mapped[str | None] = mapped_column(String(32), nullable=True)
    time_millis: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fastest_lap_rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fastest_lap_time: Mapped[str | None] = mapped_column(String(32), nullable=True)

    race: Mapped["Race"] = relationship("Race", back_populates="results")
    driver: Mapped["Driver"] = relationship("Driver", back_populates="results")
    constructor: Mapped["Constructor"] = relationship("Constructor", back_populates="results")
