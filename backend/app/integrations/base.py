"""Provider-agnostic contracts for external F1 data sources.

Concrete clients (Jolpica in Phase 2, OpenF1 in Phase 7) implement these so the
services layer never depends on a specific provider's payload shape.
"""
from typing import Any, Protocol


class HistoricalDataProvider(Protocol):
    """Season/historical data (drivers, constructors, circuits, races, results)."""

    name: str

    async def fetch_season_schedule(self, year: int) -> list[dict[str, Any]]: ...


class LiveDataProvider(Protocol):
    """Live timing provider reserved for the future Live Race Center."""

    name: str
