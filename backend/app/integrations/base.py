"""Provider-agnostic contracts for external F1 data sources.

Concrete clients (Jolpica in Phase 2, OpenF1 in Phase 7) implement these so the
services layer never depends on a specific provider's payload shape.
"""
from typing import Any, Protocol


class HistoricalDataProvider(Protocol):
    """Season/historical data (drivers, constructors, circuits, races, results, standings)."""

    name: str

    async def fetch_season_schedule(self, year: int) -> list[dict[str, Any]]: ...

    async def fetch_circuits(self, year: int | None = None) -> list[dict[str, Any]]: ...

    async def fetch_drivers(self, year: int | None = None) -> list[dict[str, Any]]: ...

    async def fetch_constructors(self, year: int | None = None) -> list[dict[str, Any]]: ...

    async def fetch_race_results(self, year: int, round_number: int | None = None) -> list[dict[str, Any]]: ...

    async def fetch_driver_standings(self, year: int) -> list[dict[str, Any]]: ...

    async def fetch_constructor_standings(self, year: int) -> list[dict[str, Any]]: ...


class LiveDataProvider(Protocol):
    """Live timing provider reserved for the future Live Race Center."""

    name: str
