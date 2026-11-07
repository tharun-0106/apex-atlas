# Architecture

## Backend layering

```
router (HTTP, validation) → service (business logic) → repository (DB) → models
                                   ↓
                            integrations (external providers)
```

- `core/` config (env-driven), logging, DB engine/session.
- `models/` SQLAlchemy 2.0 ORM models (`Season`, `Circuit`, `Driver`, `Constructor`, `Race`, `Result`, `DriverStanding`, `ConstructorStanding`).
- `repositories/` Database access routines (`CircuitRepository`, `DriverRepository`, etc.) supporting conflict-safe upserts.
- `services/` Business logic & sync service (`SyncService`, `CircuitService`, `DriverService`, `RaceService`, `StandingsService`).
- `schemas/` Pydantic request/response models.
- `integrations/base.py` provider protocols. Concrete `JolpicaClient` fetches and normalizes Jolpica Ergast API payloads.
- All routes are mounted under `/api/v1` (`/health`, `/seasons`, `/circuits`, `/drivers`, `/races`, `/standings`, `/sync`).

## Frontend layering

`pages` compose `components`; data flows through `services` (Axios, typed with `types/`) and the `useAsync`
hook, which standardizes loading and error states (`LoadingSkeleton`, `ErrorState`, `EmptyState`).

- `Home.tsx` loads live season statistics, next/featured Grand Prix, featured circuits, championship leaders, latest race results, and top standings preview.

## Preparing for the Live Race Center

- Provider protocols already separate historical and live sources.
- A `/api/v1/live` router and WebSocket endpoint can be added beside existing routers without restructuring.
- Redis can slot in behind the service layer as a cache; nothing in the current code assumes its absence.

## Roadmap & Status

- [x] **Phase 1: Foundation** (FastAPI, React + TypeScript, PostgreSQL, health checks)
- [x] **Phase 2: Data Integration** (Jolpica client, schema migrations, sync pipeline, REST API endpoints, live homepage data)
- [ ] **Phase 3: Circuit Explorer** (Interactive track maps, telemetry coordinates, DRS zones, circuit detail views)
- [ ] **Phase 4: Driver & Constructor Explorer** (Profiles, head-to-head records, career breakdowns)
- [ ] **Phase 5: Calendar & Analytics** (Interactive race weekends, countdown timers, Recharts championship progression)
- [ ] **Phase 6: Advanced Experience** (Three.js 3D track/car visualizations)
- [ ] **Phase 7: Live Race Center** (OpenF1, WebSockets, real-time timing & telemetry)
