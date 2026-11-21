import { Link, useParams } from 'react-router-dom'
import CircuitTrackMap from '../components/CircuitTrackMap'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PageTransition from '../components/PageTransition'
import { useAsync } from '../hooks/useAsync'
import { getCircuitDetails } from '../services/circuitService'
import { getCircuitSpec } from '../utils/circuitSpecs'
import { getCountryFlag } from '../utils/countryFlags'
import { getTeamTheme } from '../utils/f1Teams'

export default function CircuitDetail() {
  const { circuitRef } = useParams<{ circuitRef: string }>()
  const ref = circuitRef ?? 'silverstone'

  const { data, loading, error, reload } = useAsync(() => getCircuitDetails(ref), [ref])
  const spec = getCircuitSpec(ref)

  if (loading) {
    return (
      <PageTransition>
        <div className="container-x py-16 space-y-8">
          <LoadingSkeleton className="h-8 w-48" />
          <LoadingSkeleton className="h-16 w-3/4" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <LoadingSkeleton className="h-96 lg:col-span-2" />
            <LoadingSkeleton className="h-96" />
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error || !data) {
    return (
      <PageTransition>
        <div className="container-x py-20">
          <Link to="/circuits" className="btn-ghost mb-6 inline-flex items-center gap-2">
            ← Back to All Circuits
          </Link>
          <ErrorState
            title="Circuit Not Found"
            message={error ?? `Could not load telemetry or data for circuit '${ref}'.`}
            onRetry={reload}
          />
        </div>
      </PageTransition>
    )
  }

  const { circuit, races, total_races } = data
  const flag = getCountryFlag(circuit.country)
  const lengthMiles = (spec.lengthKm * 0.621371).toFixed(3)
  const mapsUrl = circuit.latitude && circuit.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${circuit.latitude},${circuit.longitude}`
    : undefined

  return (
    <PageTransition>
      <div className="container-x py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
          <Link to="/circuits" className="hover:text-apex transition-colors">
            Circuits
          </Link>
          <span>/</span>
          <span className="text-fg font-bold">{circuit.name}</span>
        </div>

        {/* Hero Header */}
        <div className="flex flex-col gap-6 border-b border-line/40 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{flag}</span>
              <span className="eyebrow">{circuit.country ?? 'Formula 1 Circuit'}</span>
              <span className="rounded bg-surface/80 border border-line px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                {spec.type}
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl font-black uppercase tracking-wider text-fg">
              {circuit.name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {circuit.location ? `${circuit.location}, ` : ''}{circuit.country} · Hosted {total_races} {total_races === 1 ? 'Grand Prix' : 'Grands Prix'} in archive
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost text-xs"
              >
                Satellite Map ↗
              </a>
            )}
            {circuit.url && (
              <a
                href={circuit.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs"
              >
                Official Info ↗
              </a>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Track Map & Specifications */}
          <div className="space-y-8 lg:col-span-7">
            {/* Interactive Track Layout Map */}
            <div className="surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-apex font-semibold">Track Geometry</span>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wider text-fg">
                    Layout & DRS Zones
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted">Scale Model</span>
              </div>
              <CircuitTrackMap spec={spec} className="h-80 w-full" />
            </div>

            {/* Technical Specifications */}
            <div className="surface p-6">
              <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wider text-fg border-b border-line/40 pb-3">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div className="border-l-2 border-apex pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Track Length</p>
                  <p className="mt-1 font-mono text-xl font-bold text-fg">{spec.lengthKm} km</p>
                  <p className="text-[11px] text-muted">{lengthMiles} miles</p>
                </div>
                <div className="border-l-2 border-line pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Number of Turns</p>
                  <p className="mt-1 font-mono text-xl font-bold text-fg">{spec.turns}</p>
                  <p className="text-[11px] text-muted">{spec.direction}</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">DRS Zones</p>
                  <p className="mt-1 font-mono text-xl font-bold text-emerald-400">{spec.drsZones}</p>
                  <p className="text-[11px] text-muted">Detection zones</p>
                </div>
                <div className="border-l-2 border-line pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">First Hosted</p>
                  <p className="mt-1 font-mono text-xl font-bold text-fg">{spec.firstGrandPrix}</p>
                  <p className="text-[11px] text-muted">World Championship</p>
                </div>
                <div className="border-l-2 border-line pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Circuit Type</p>
                  <p className="mt-1 font-mono text-base font-bold text-fg">{spec.type}</p>
                  <p className="text-[11px] text-muted">FIA Grade 1</p>
                </div>
                <div className="border-l-2 border-line pl-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Coordinates</p>
                  <p className="mt-1 font-mono text-xs font-bold text-fg">
                    {circuit.latitude ? `${circuit.latitude.toFixed(3)}°N` : '—'}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {circuit.longitude ? `${circuit.longitude.toFixed(3)}°E` : '—'}
                  </p>
                </div>
              </div>

              {/* Lap Record Callout */}
              <div className="mt-8 rounded-lg border border-line/60 bg-surface/50 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-apex">All-Time Lap Record</span>
                    <p className="font-mono text-2xl font-black text-fg">{spec.lapRecord.time}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-display font-bold text-fg">{spec.lapRecord.driver}</p>
                    <p className="text-xs text-muted">
                      {spec.lapRecord.constructor} ({spec.lapRecord.year})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Historical Races & Winners */}
          <div className="space-y-6 lg:col-span-5">
            <div className="surface p-6">
              <div className="mb-6 flex items-center justify-between border-b border-line/40 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-apex font-semibold">Race Archive</span>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wider text-fg">
                    Grand Prix History
                  </h3>
                </div>
                <span className="rounded bg-surface px-2.5 py-1 text-xs font-mono font-bold text-muted border border-line">
                  {races.length} Races
                </span>
              </div>

              {races.length > 0 ? (
                <div className="space-y-3">
                  {races.map((r) => {
                    const theme = getTeamTheme(r.winner_constructor_ref)
                    return (
                      <div
                        key={r.race_id}
                        className="rounded-lg border border-line/50 bg-surface/40 p-3.5 transition hover:border-line hover:bg-surface/80"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-apex">
                            {r.season_year} · Round {r.round}
                          </span>
                          <span className="text-[11px] font-mono text-muted">{r.date}</span>
                        </div>
                        <h4 className="mt-1 font-display text-base font-bold text-fg">{r.name}</h4>

                        {/* Winner Row */}
                        <div className="mt-3 flex items-center justify-between border-t border-line/30 pt-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 font-display text-[10px] font-black text-ink">
                              1
                            </span>
                            <span className="font-medium text-fg">
                              {r.winner_driver ?? 'Pending Result'}
                            </span>
                          </div>
                          {r.winner_constructor && (
                            <span
                              className="font-semibold flex items-center gap-1.5"
                              style={{ color: theme.primary }}
                            >
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                              {r.winner_constructor}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No race records"
                  message="No past race results recorded for this circuit yet."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
