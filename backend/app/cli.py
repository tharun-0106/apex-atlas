"""CLI management commands for Apex Atlas."""
import argparse
import asyncio
import sys

from app.core.database import get_session_factory
from app.core.logging import configure_logging
from app.services.sync import SyncService


async def _run_sync(year: int) -> None:
    session_factory = get_session_factory()
    with session_factory() as db:
        service = SyncService(db)
        summary = await service.sync_season(year)
        print(f"Sync complete for {year}:")
        for k, v in summary.items():
            print(f"  {k}: {v}")


def main() -> None:
    configure_logging("INFO")
    parser = argparse.ArgumentParser(description="Apex Atlas CLI tools")
    subparsers = parser.add_subparsers(dest="command", required=True)

    sync_parser = subparsers.add_parser("sync", help="Synchronize season data from Jolpica")
    sync_parser.add_argument("--year", type=int, default=2024, help="F1 season year to sync (default: 2024)")

    args = parser.parse_args()

    if args.command == "sync":
        asyncio.run(_run_sync(args.year))
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
