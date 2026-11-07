from typing import TYPE_CHECKING
from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.race import Race


class Circuit(Base):
    __tablename__ = "circuits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    circuit_ref: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    location: Mapped[str | None] = mapped_column(String(128), nullable=True)
    country: Mapped[str | None] = mapped_column(String(64), index=True, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    races: Mapped[list["Race"]] = relationship("Race", back_populates="circuit")
