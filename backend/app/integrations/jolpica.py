"""Jolpica (Ergast-compatible) F1 API client."""
import logging
from typing import Any, Callable

import httpx

from app.core.config import get_settings
from app.integrations.base import HistoricalDataProvider

logger = logging.getLogger("apex_atlas.integrations.jolpica")


class JolpicaClient(HistoricalDataProvider):
    name = "jolpica"

    def __init__(self, base_url: str | None = None, timeout: float | None = None) -> None:
        settings = get_settings()
        self.base_url = (base_url or settings.jolpica_base_url).rstrip("/")
        self.timeout = timeout or settings.http_timeout_seconds

    async def _get_page(self, client: httpx.AsyncClient, path: str, limit: int = 100, offset: int = 0) -> dict[str, Any]:
        url = f"{self.base_url}/{path.lstrip('/')}"
        params = {"limit": limit, "offset": offset}
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()

    async def _fetch_all(
        self,
        path: str,
        extract_items: Callable[[dict[str, Any]], list[dict[str, Any]]],
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        offset = 0

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            while True:
                data = await self._get_page(client, path, limit=limit, offset=offset)
                mr_data = data.get("MRData", {})
                batch = extract_items(mr_data)
                if not batch:
                    break

                items.extend(batch)
                total = int(mr_data.get("total", len(items)))
                offset += limit
                if offset >= total:
                    break

        return items

    async def fetch_season_schedule(self, year: int) -> list[dict[str, Any]]:
        path = f"{year}.json"
        return await self._fetch_all(
            path,
            lambda mr: mr.get("RaceTable", {}).get("Races", []),
        )

    async def fetch_circuits(self, year: int | None = None) -> list[dict[str, Any]]:
        path = f"{year}/circuits.json" if year else "circuits.json"
        return await self._fetch_all(
            path,
            lambda mr: mr.get("CircuitTable", {}).get("Circuits", []),
        )

    async def fetch_drivers(self, year: int | None = None) -> list[dict[str, Any]]:
        path = f"{year}/drivers.json" if year else "drivers.json"
        return await self._fetch_all(
            path,
            lambda mr: mr.get("DriverTable", {}).get("Drivers", []),
        )

    async def fetch_constructors(self, year: int | None = None) -> list[dict[str, Any]]:
        path = f"{year}/constructors.json" if year else "constructors.json"
        return await self._fetch_all(
            path,
            lambda mr: mr.get("ConstructorTable", {}).get("Constructors", []),
        )

    async def fetch_race_results(self, year: int, round_number: int | None = None) -> list[dict[str, Any]]:
        path = f"{year}/{round_number}/results.json" if round_number else f"{year}/results.json"
        return await self._fetch_all(
            path,
            lambda mr: mr.get("RaceTable", {}).get("Races", []),
        )

    async def fetch_driver_standings(self, year: int) -> list[dict[str, Any]]:
        path = f"{year}/driverStandings.json"
        lists = await self._fetch_all(
            path,
            lambda mr: mr.get("StandingsTable", {}).get("StandingsLists", []),
        )
        if not lists:
            return []
        return lists[0].get("DriverStandings", [])

    async def fetch_constructor_standings(self, year: int) -> list[dict[str, Any]]:
        path = f"{year}/constructorStandings.json"
        lists = await self._fetch_all(
            path,
            lambda mr: mr.get("StandingsTable", {}).get("StandingsLists", []),
        )
        if not lists:
            return []
        return lists[0].get("ConstructorStandings", [])
