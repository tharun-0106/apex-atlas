"""Data synchronization service from external providers (Jolpica) into PostgreSQL."""
from datetime import date, datetime, time
import logging
from typing import Any

from sqlalchemy.orm import Session

from app.integrations.jolpica import JolpicaClient
from app.repositories.circuits import CircuitRepository
from app.repositories.constructors import ConstructorRepository
from app.repositories.drivers import DriverRepository
from app.repositories.races import RaceRepository
from app.repositories.results import ResultRepository
from app.repositories.seasons import SeasonRepository
from app.repositories.standings import StandingsRepository

logger = logging.getLogger("apex_atlas.services.sync")


def _parse_time(time_str: str | None) -> time | None:
    if not time_str:
        return None
    time_clean = time_str.rstrip("Z")
    try:
        return datetime.strptime(time_clean, "%H:%M:%S").time()
    except ValueError:
        try:
            return datetime.strptime(time_clean, "%H:%M").time()
        except ValueError:
            return None


def _parse_date(date_str: str | None) -> date | None:
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None


class SyncService:
    def __init__(self, db: Session, client: JolpicaClient | None = None) -> None:
        self.db = db
        self.client = client or JolpicaClient()
        self.circuits = CircuitRepository(db)
        self.drivers = DriverRepository(db)
        self.constructors = ConstructorRepository(db)
        self.races = RaceRepository(db)
        self.results = ResultRepository(db)
        self.standings = StandingsRepository(db)
        self.seasons = SeasonRepository(db)

    async def sync_season(self, year: int) -> dict[str, Any]:
        logger.info("Starting sync for F1 season %d", year)
        self.seasons.upsert(year=year, url=f"https://en.wikipedia.org/wiki/{year}_Formula_One_World_Championship")

        # 1. Circuits
        raw_circuits = await self.client.fetch_circuits(year)
        synced_circuits = 0
        for item in raw_circuits:
            loc = item.get("Location", {})
            c_data = {
                "circuit_ref": item["circuitId"],
                "name": item.get("circuitName", item["circuitId"]),
                "location": loc.get("locality"),
                "country": loc.get("country"),
                "latitude": float(loc["lat"]) if "lat" in loc else None,
                "longitude": float(loc["long"]) if "long" in loc else None,
                "url": item.get("url"),
            }
            self.circuits.upsert(c_data)
            synced_circuits += 1

        # 2. Drivers
        raw_drivers = await self.client.fetch_drivers(year)
        synced_drivers = 0
        for item in raw_drivers:
            d_data = {
                "driver_ref": item["driverId"],
                "code": item.get("code"),
                "permanent_number": int(item["permanentNumber"]) if item.get("permanentNumber") else None,
                "forename": item.get("givenName", ""),
                "surname": item.get("familyName", ""),
                "date_of_birth": _parse_date(item.get("dateOfBirth")),
                "nationality": item.get("nationality"),
                "url": item.get("url"),
            }
            self.drivers.upsert(d_data)
            synced_drivers += 1

        # 3. Constructors
        raw_constructors = await self.client.fetch_constructors(year)
        synced_constructors = 0
        for item in raw_constructors:
            ct_data = {
                "constructor_ref": item["constructorId"],
                "name": item.get("name", item["constructorId"]),
                "nationality": item.get("nationality"),
                "url": item.get("url"),
            }
            self.constructors.upsert(ct_data)
            synced_constructors += 1

        self.db.commit()

        # 4. Schedule / Races
        raw_races = await self.client.fetch_season_schedule(year)
        synced_races = 0
        for item in raw_races:
            c_ref = item.get("Circuit", {}).get("circuitId")
            circuit = self.circuits.get_by_ref(c_ref) if c_ref else None
            if not circuit:
                logger.warning("Circuit %s not found for race %s", c_ref, item.get("raceName"))
                continue

            r_data = {
                "season_year": int(item["season"]),
                "round": int(item["round"]),
                "circuit_id": circuit.id,
                "name": item.get("raceName", f"Round {item['round']}"),
                "date": _parse_date(item.get("date")),
                "time": _parse_time(item.get("time")),
                "url": item.get("url"),
            }
            self.races.upsert(r_data)
            synced_races += 1

        self.db.commit()

        # 5. Race Results
        raw_race_results = await self.client.fetch_race_results(year)
        synced_results = 0
        for race_item in raw_race_results:
            round_num = int(race_item["round"])
            race = self.races.get_by_season_and_round(year, round_num)
            if not race:
                continue

            for res in race_item.get("Results", []):
                d_ref = res.get("Driver", {}).get("driverId")
                c_ref = res.get("Constructor", {}).get("constructorId")
                driver = self.drivers.get_by_ref(d_ref) if d_ref else None
                constructor = self.constructors.get_by_ref(c_ref) if c_ref else None

                if not driver or not constructor:
                    continue

                time_info = res.get("Time", {})
                fastest_lap = res.get("FastestLap", {})
                fastest_lap_time = fastest_lap.get("Time", {}).get("time")

                result_data = {
                    "race_id": race.id,
                    "driver_id": driver.id,
                    "constructor_id": constructor.id,
                    "number": int(res["number"]) if res.get("number") else None,
                    "grid": int(res["grid"]) if res.get("grid") else None,
                    "position": int(res["position"]) if res.get("position") and res["position"].isdigit() else None,
                    "position_text": res.get("positionText"),
                    "points": float(res.get("points", 0.0)),
                    "laps": int(res.get("laps", 0)),
                    "status": res.get("status"),
                    "time_text": time_info.get("time"),
                    "time_millis": int(time_info["millis"]) if time_info.get("millis") else None,
                    "fastest_lap_rank": int(fastest_lap["rank"]) if fastest_lap.get("rank") else None,
                    "fastest_lap_time": fastest_lap_time,
                }
                self.results.upsert(result_data)
                synced_results += 1

        self.db.commit()

        # 6. Driver Standings
        raw_driver_standings = await self.client.fetch_driver_standings(year)
        synced_driver_standings = 0
        for idx, ds in enumerate(raw_driver_standings):
            d_ref = ds.get("Driver", {}).get("driverId")
            driver = self.drivers.get_by_ref(d_ref) if d_ref else None
            if not driver:
                continue

            pos_val = ds.get("position") or ds.get("positionText")
            pos = int(pos_val) if pos_val and str(pos_val).isdigit() else idx + 1

            standing_data = {
                "season_year": year,
                "driver_id": driver.id,
                "round": 0,
                "points": float(ds.get("points", 0.0)),
                "position": pos,
                "position_text": ds.get("positionText", str(pos)),
                "wins": int(ds.get("wins", 0)),
            }
            self.standings.upsert_driver_standing(standing_data)
            synced_driver_standings += 1

        # 7. Constructor Standings
        raw_constructor_standings = await self.client.fetch_constructor_standings(year)
        synced_constructor_standings = 0
        for idx, cs in enumerate(raw_constructor_standings):
            c_ref = cs.get("Constructor", {}).get("constructorId")
            constructor = self.constructors.get_by_ref(c_ref) if c_ref else None
            if not constructor:
                continue

            pos_val = cs.get("position") or cs.get("positionText")
            pos = int(pos_val) if pos_val and str(pos_val).isdigit() else idx + 1

            cs_data = {
                "season_year": year,
                "constructor_id": constructor.id,
                "round": 0,
                "points": float(cs.get("points", 0.0)),
                "position": pos,
                "position_text": cs.get("positionText", str(pos)),
                "wins": int(cs.get("wins", 0)),
            }
            self.standings.upsert_constructor_standing(cs_data)
            synced_constructor_standings += 1

        self.db.commit()

        summary = {
            "year": year,
            "circuits": synced_circuits,
            "drivers": synced_drivers,
            "constructors": synced_constructors,
            "races": synced_races,
            "results": synced_results,
            "driver_standings": synced_driver_standings,
            "constructor_standings": synced_constructor_standings,
        }
        logger.info("Successfully synced F1 season %d: %s", year, summary)
        return summary
