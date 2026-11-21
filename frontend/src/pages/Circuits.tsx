import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CircuitTrackMap from '../components/CircuitTrackMap'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PageTransition from '../components/PageTransition'
import { useAsync } from '../hooks/useAsync'
import { getCircuits } from '../services/circuitService'
import { getCircuitSpec } from '../utils/circuitSpecs'
import { getCountryFlag } from '../utils/countryFlags'

type RegionFilter = 'All' | 'Europe' | 'Americas' | 'Asia & Middle East' | 'Oceania'
type TypeFilter = 'All' | 'Purpose-built' | 'Street circuit'
type SortBy = 'name' | 'length' | 'turns' | 'country'

export default function Circuits() {
  const { data: circuits, loading, error, reload } = useAsync(getCircuits)

  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<RegionFilter>('All')
  const [circuitType, setCircuitType] = useState<TypeFilter>('All')
  const [sortBy, setSortBy] = useState<SortBy>('name')

  // Combine DB circuit items with verified technical specs
  const circuitsWithSpecs = useMemo(() => {
    if (!circuits) return []
    return circuits.map((c) => {
      const spec = getCircuitSpec(c.circuit_ref)
      return {
        ...c,
        spec,
        flag: getCountryFlag(c.country),
      }
    })
  }, [circuits])

  // Filter and sort circuits
  const filteredCircuits = useMemo(() => {
    return circuitsWithSpecs
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.location && c.location.toLowerCase().includes(search.toLowerCase())) ||
          (c.country && c.country.toLowerCase().includes(search.toLowerCase()))

        const matchesRegion = region === 'All' || c.spec.region === region
        const matchesType = circuitType === 'All' || c.spec.type === circuitType

        return matchesSearch && matchesRegion && matchesType
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'country') return (a.country ?? '').localeCompare(b.country ?? '')
        if (sortBy === 'length') return b.spec.lengthKm - a.spec.lengthKm
        if (sortBy === 'turns') return b.spec.turns - a.spec.turns
        return 0
      })
  }, [circuitsWithSpecs, search, region, circuitType, sortBy])

  return (
    <PageTransition>
      {/* Hero Header & Explorer Overview */}
      <section className="border-b border-line/40 bg-surface/30 py-16">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="eyebrow">Formula 1 Circuits</span>
              <h1 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-wider text-fg">
                Circuit Explorer
              </h1>
              <p className="mt-4 text-base text-muted leading-relaxed">
                Explore the technical geometry of modern Formula 1 racetracks. Analyze DRS activation zones, track lengths, elevation profiles, and historic lap records across the global championship calendar.
              </p>
            </div>

            {/* Global Stats Overview */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-lg border border-line bg-surface/80 px-4 py-3 min-w-[130px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Grand Prix Tracks</span>
                <p className="mt-1 font-display text-3xl font-black text-fg">{circuits?.length ?? 24}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface/80 px-4 py-3 min-w-[130px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Longest Circuit</span>
                <p className="mt-1 font-display text-2xl font-black text-apex">Spa (7.0 km)</p>
              </div>
              <div className="rounded-lg border border-line bg-surface/80 px-4 py-3 min-w-[130px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Shortest Circuit</span>
                <p className="mt-1 font-display text-2xl font-black text-fg">Monaco (3.3 km)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search, Filter & View Controls */}
      <section className="container-x py-8">
        <div className="space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by circuit, city, or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface/80 px-4 py-2.5 pl-10 text-sm text-fg placeholder-muted/60 transition focus:border-apex focus:outline-none"
              />
              <svg
                className="absolute left-3.5 top-3 h-4 w-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-muted hover:text-fg"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Controls Right (Sort & Type) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <select
                value={circuitType}
                onChange={(e) => setCircuitType(e.target.value as TypeFilter)}
                className="rounded-lg border border-line bg-surface/80 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-fg transition hover:border-apex/60 focus:border-apex focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="Purpose-built">Purpose-Built</option>
                <option value="Street circuit">Street Circuit</option>
              </select>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="rounded-lg border border-line bg-surface/80 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-fg transition hover:border-apex/60 focus:border-apex focus:outline-none"
              >
                <option value="name">Sort: Name (A-Z)</option>
                <option value="length">Sort: Longest Track</option>
                <option value="turns">Sort: Most Turns</option>
                <option value="country">Sort: Country</option>
              </select>
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line/40 pb-4">
            {(['All', 'Europe', 'Americas', 'Asia & Middle East', 'Oceania'] as RegionFilter[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                  region === r
                    ? 'bg-apex text-white shadow-sm shadow-apex/30'
                    : 'bg-surface/60 text-muted hover:text-fg hover:bg-surface'
                }`}
              >
                {r === 'All' ? 'All Regions' : r}
              </button>
            ))}
            <span className="ml-auto text-xs font-mono text-muted">
              Showing {filteredCircuits.length} of {circuitsWithSpecs.length} Tracks
            </span>
          </div>
        </div>
      </section>

      {/* Circuit Cards Grid */}
      <section className="container-x pb-20">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <LoadingSkeleton className="h-96 w-full" />
            <LoadingSkeleton className="h-96 w-full" />
            <LoadingSkeleton className="h-96 w-full" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : filteredCircuits.length === 0 ? (
          <EmptyState
            title="No matching circuits found"
            message={`No circuits matched your filter criteria for "${search}". Try clearing search or region filters.`}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCircuits.map((c) => (
              <div
                key={c.circuit_ref}
                className="surface group relative flex flex-col justify-between overflow-hidden border border-line p-5 transition duration-200 hover:border-apex/60 hover:shadow-xl hover:shadow-apex/5"
              >
                {/* Header Row */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-xs uppercase tracking-widest text-muted">{c.country}</span>
                    </div>
                    <span className="rounded bg-surface/90 border border-line/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                      {c.spec.type}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-black uppercase tracking-wide text-fg group-hover:text-apex transition-colors">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {c.location ? `${c.location}, ` : ''}{c.country}
                  </p>

                  {/* Visual SVG Track Preview */}
                  <div className="mt-5">
                    <CircuitTrackMap spec={c.spec} className="h-44 w-full" />
                  </div>

                  {/* Track Telemetry Highlights */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line/40 pt-4 text-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Length</span>
                      <p className="font-mono text-sm font-bold text-fg">{c.spec.lengthKm} km</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Turns</span>
                      <p className="font-mono text-sm font-bold text-fg">{c.spec.turns}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">DRS</span>
                      <p className="font-mono text-sm font-bold text-emerald-400">{c.spec.drsZones} Zones</p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 border-t border-line/30 pt-3">
                  <Link
                    to={`/circuits/${c.circuit_ref}`}
                    className="btn-ghost flex w-full items-center justify-center gap-2 !py-2.5 text-xs uppercase tracking-wider group-hover:border-apex group-hover:text-apex"
                  >
                    <span>Telemetry & History</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  )
}
