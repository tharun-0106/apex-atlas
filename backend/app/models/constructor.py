from typing import TYPE_CHECKING
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.result import Result
    from app.models.standing import ConstructorStanding


class Constructor(Base):
    __tablename__ = "constructors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    constructor_ref: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    nationality: Mapped[str | None] = mapped_column(String(64), nullable=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    results: Mapped[list["Result"]] = relationship("Result", back_populates="constructor")
    standings: Mapped[list["ConstructorStanding"]] = relationship("ConstructorStanding", back_populates="constructor")
