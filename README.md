# Apex Atlas

**Beyond the Grid. Explore Circuits. Discover Drivers. Experience Formula 1.**

An interactive Formula 1 exploration and analytics platform. This repository currently contains the
**Phase 1 foundation**: a FastAPI backend with a health check, PostgreSQL configuration, and a React +
TypeScript frontend with the Apex Atlas homepage.

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| Backend  | Python, FastAPI, SQLAlchemy 2, Alembic, Pydantic v2, HTTPX |
| Database | PostgreSQL 16 |

Recharts, MapLibre GL and Three.js are added in the phases that use them.

## Run locally

Prerequisites: [uv](https://docs.astral.sh/uv/), Node 18+, Docker (for PostgreSQL) or a local PostgreSQL install.
Add dependencies with `uv add <package>` (or `uv add --dev <package>`).

```bash
# 1. Database
docker compose up -d db

# 2. Backend  (http://localhost:8000, docs at /docs)
cd backend
uv sync                      # creates .venv and installs locked dependencies
cp .env.example .env         # Windows PowerShell: copy .env.example .env
uv run uvicorn app.main:app --reload

# 3. Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8000`, so no CORS setup is needed in development.
The homepage footer-of-hero indicator shows live status of the API and database.

Health check: `GET /api/v1/health` returns `{"status": "ok" | "degraded", "database": "up" | "down", ...}`.
It responds even when PostgreSQL is down (status `degraded`).

## Tests

```bash
cd backend && uv run pytest
cd frontend && npm run build   # type-checks and builds
```

## Project structure

```
apex-atlas/
├── frontend/src/   components · pages · hooks · services · types · utils · styles
├── backend/app/    core · models · schemas · routers · services · repositories · integrations · data
├── backend/alembic/  migrations (empty until Phase 2)
├── docs/
└── docker-compose.yml
```

## Data principles

- Season statistics, results, and dates are never hardcoded. Until Phase 2 wires real data, homepage sections
  show explicit empty states and stat cards show "—".
- Circuit geometry, DRS zones, elevation and lap records will only be shown when sourced from verified data.
- Provider access goes through `backend/app/integrations`, so Jolpica (Phase 2) and OpenF1 (Phase 7) stay
  swappable behind a normalized internal model.

## Roadmap

1. **Foundation** (this commit)
2. Data integration (Jolpica → PostgreSQL)
3. Circuit Explorer
4. Driver Explorer
5. Calendar and analytics
6. Advanced experience
7. Live Race Center (OpenF1, WebSockets, Redis)

See [docs/architecture.md](docs/architecture.md).
