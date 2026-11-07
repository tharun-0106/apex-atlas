from fastapi.testclient import TestClient

from app.main import app
from app.routers.health import get_optional_db


class _FakeDB:
    def execute(self, *_a, **_k):
        return 1


class _BrokenDB:
    def execute(self, *_a, **_k):
        raise RuntimeError("db unavailable")


def test_health_ok_when_database_up():
    app.dependency_overrides[get_optional_db] = lambda: _FakeDB()
    res = TestClient(app).get("/api/v1/health")
    app.dependency_overrides.clear()
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["database"] == "up"


def test_health_degraded_when_database_down():
    app.dependency_overrides[get_optional_db] = lambda: _BrokenDB()
    res = TestClient(app).get("/api/v1/health")
    app.dependency_overrides.clear()
    assert res.status_code == 200
    assert res.json()["status"] == "degraded"
    assert res.json()["database"] == "down"
