from fastapi.testclient import TestClient

from app.main import app
from app.routers.health import get_optional_db


class _FakeDB:
    def execute(self, *_a, **_k):
        return 1


class _BrokenDB:
    def execute(self, *_a, **_k):
        raise RuntimeError("db unavailable")


def _fake_db_override():
    yield _FakeDB()


def _broken_db_override():
    yield _BrokenDB()


def test_health_ok_when_database_up():
    app.dependency_overrides[get_optional_db] = _fake_db_override
    try:
        with TestClient(app) as client:
            res = client.get("/api/v1/health")
            assert res.status_code == 200
            body = res.json()
            assert body["status"] == "ok"
            assert body["database"] == "up"
    finally:
        app.dependency_overrides.clear()


def test_health_degraded_when_database_down():
    app.dependency_overrides[get_optional_db] = _broken_db_override
    try:
        with TestClient(app) as client:
            res = client.get("/api/v1/health")
            assert res.status_code == 200
            body = res.json()
            assert body["status"] == "degraded"
            assert body["database"] == "down"
    finally:
        app.dependency_overrides.clear()
