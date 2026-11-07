# Architecture

## Backend layering

```
router (HTTP, validation) → service (business logic) → repository (DB) → models
                                   ↓
                            integrations (external providers)
```

- `core/` config (env-driven), logging, DB engine/session.
- `schemas/` Pydantic request/response models.
- `integrations/base.py` provider protocols. Concrete Jolpica/OpenF1 clients implement them; services only
  see normalized data.
- All routes are mounted under `/api/v1`.

## Frontend layering

`pages` compose `components`; data flows through `services` (Axios, typed with `types/`) and the `useAsync`
hook, which standardizes loading and error states (`LoadingSkeleton`, `ErrorState`, `EmptyState`).

## Preparing for the Live Race Center

- Provider protocols already separate historical and live sources.
- A `/api/v1/live` router and WebSocket endpoint can be added beside existing routers without restructuring.
- Redis can slot in behind the service layer as a cache; nothing in the current code assumes its absence.

## Open items for Phase 2

- Confirm Jolpica rate limits, licensing and attribution requirements before syncing data.
- Define normalized models and the first Alembic migration (provider ids stored for reconciliation).
