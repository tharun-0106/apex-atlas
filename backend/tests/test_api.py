from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_seasons():
    res = client.get("/api/v1/seasons")
    assert res.status_code == 200
    seasons = res.json()
    assert isinstance(seasons, list)
    assert len(seasons) >= 10
    assert 2026 in seasons
    assert 2017 in seasons


def test_season_summary():
    res = client.get("/api/v1/seasons/summary")
    assert res.status_code == 200
    data = res.json()
    assert "year" in data
    assert "total_races" in data
    assert "completed_races" in data


def test_circuits_endpoint():
    res = client.get("/api/v1/circuits")
    assert res.status_code == 200
    circuits = res.json()
    assert isinstance(circuits, list)
    if circuits:
        assert "circuit_ref" in circuits[0]
        assert "name" in circuits[0]


def test_drivers_endpoint():
    res = client.get("/api/v1/drivers")
    assert res.status_code == 200
    drivers = res.json()
    assert isinstance(drivers, list)
    if drivers:
        assert "driver_ref" in drivers[0]
        assert "surname" in drivers[0]


def test_races_endpoint():
    res = client.get("/api/v1/races")
    assert res.status_code == 200
    races = res.json()
    assert isinstance(races, list)


def test_upcoming_and_latest_race():
    upcoming = client.get("/api/v1/races/upcoming")
    assert upcoming.status_code == 200

    latest = client.get("/api/v1/races/latest-completed")
    assert latest.status_code == 200


def test_standings_endpoints():
    drivers_standing = client.get("/api/v1/standings/drivers?limit=5")
    assert drivers_standing.status_code == 200
    ds = drivers_standing.json()
    assert isinstance(ds, list)

    constructors_standing = client.get("/api/v1/standings/constructors?limit=5")
    assert constructors_standing.status_code == 200
    cs = constructors_standing.json()
    assert isinstance(cs, list)
