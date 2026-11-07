from typing import TYPE_CHECKING
from sqlalchemy import Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.constructor import Constructor
    from app.models.driver import Driver
    from app.models.season import Season


class DriverStanding(Base):
    __tablename__ = "driver_standings"
    __table_args__ = (
        UniqueConstraint("season_year", "driver_id", "round", name="uq_driver_standing_season_driver_round"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    season_year: Mapped[int] = mapped_column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), index=True, nullable=False)
    driver_id: Mapped[int] = mapped_column(Integer, ForeignKey("drivers.id", ondelete="RESTRICT"), index=True, nullable=False)
    round: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    points: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    position_text: Mapped[str | None] = mapped_column(String(16), nullable=True)
    wins: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    season: Mapped["Season"] = relationship("Season", back_populates="driver_standings")
    driver: Mapped["Driver"] = relationship("Driver", back_populates="standings")


class ConstructorStanding(Base):
    __tablename__ = "constructor_standings"
    __table_args__ = (
        UniqueConstraint("season_year", "constructor_id", "round", name="uq_constructor_standing_season_constructor_round"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    season_year: Mapped[int] = mapped_column(Integer, ForeignKey("seasons.year", ondelete="CASCADE"), index=True, nullable=False)
    constructor_id: Mapped[int] = mapped_column(Integer, ForeignKey("constructors.id", ondelete="RESTRICT"), index=True, nullable=False)
    round: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    points: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    position_text: Mapped[str | None] = mapped_column(String(16), nullable=True)
    wins: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    season: Mapped["Season"] = relationship("Season", back_populates="constructor_standings")
    constructor: Mapped["Constructor"] = relationship("Constructor", back_populates="standings")
