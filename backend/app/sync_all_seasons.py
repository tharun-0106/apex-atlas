"""Sync past 10 F1 seasons (2017-2026)."""
import asyncio
import logging

from app.core.database import get_session_factory
from app.core.logging import configure_logging
from app.services.sync import SyncService

logger = logging.getLogger("apex_atlas.sync_all")


async def sync_all() -> None:
    configure_logging("INFO")
    session_factory = get_session_factory()
    years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017]

    print(f"Starting sync for 10 seasons: {years}")
    for y in years:
        with session_factory() as db:
            service = SyncService(db)
            try:
                print(f"--> Syncing season {y}...")
                summary = await service.sync_season(y)
                print(f"Completed {y}: {summary['races']} races, {summary['results']} results")
            except Exception as e:
                print(f"Error syncing {y}: {e}")
                logger.exception("Error syncing season %d", y)

    print("All 10 seasons synchronized!")


if __name__ == "__main__":
    asyncio.run(sync_all())
