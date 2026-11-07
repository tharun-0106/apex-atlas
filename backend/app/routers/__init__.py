from app.routers.circuits import router as circuits_router
from app.routers.drivers import router as drivers_router
from app.routers.health import router as health_router
from app.routers.races import router as races_router
from app.routers.seasons import router as seasons_router
from app.routers.standings import router as standings_router
from app.routers.sync import router as sync_router

__all__ = [
    "circuits_router",
    "drivers_router",
    "health_router",
    "races_router",
    "seasons_router",
    "standings_router",
    "sync_router",
]
