import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Hero from '../components/Hero'
import LoadingSkeleton, { CardSkeleton } from '../components/LoadingSkeleton'
import PageTransition from '../components/PageTransition'
import RaceCountdown from '../components/RaceCountdown'
import SectionHeader from '../components/SectionHeader'
import SeasonSelector from '../components/SeasonSelector'
import StandingsTabs from '../components/StandingsTabs'
import StatCard from '../components/StatCard'
import { useAsync } from '../hooks/useAsync'
import { getCircuits } from '../services/circuitService'
import { getLatestCompletedRace, getUpcomingRace } from '../services/raceService'
import { getSeasons, getSeasonSummary } from '../services/seasonService'
import { getConstructorStandings, getDriverStandings } from '../services/standingsService'
import { getCountryFlag } from '../utils/countryFlags'
import { getTeamTheme } from '../utils/f1Teams'

export default function Home() {
  const [selectedYear, setSelectedYear] = useState<number>(2026)

  // Load available seasons
  const { data: seasonsList } = useAsync(getSeasons)
  const seasons = seasonsList && seasonsList.length > 0 ? seasonsList : [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017]

  // Synchronize initial selectedYear with latest available season
  useEffect(() => {
    if (seasonsList && seasonsList.length > 0 && !seasonsList.includes(selectedYear)) {
      setSelectedYear(seasonsList[0])
    }
  }, [seasonsList, selectedYear])

  // Data queries parameterized by selectedYear
  const {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
    reload: reloadSummary,
  } = useAsync(() => getSeasonSummary(selectedYear), [selectedYear])

  const {
    data: upcomingRace,
    loading: upcomingLoading,
    error: upcomingError,
    reload: reloadUpcoming,
  } = useAsync(() => getUpcomingRace(selectedYear), [selectedYear])

  const {
    data: circuits,
    loading: circuitsLoading,
    error: circuitsError,
    reload: reloadCircuits,
  } = useAsync(() => getCircuits(undefined, 4), [selectedYear])

  const {
    data: topDrivers,
    loading: driversLoading,
    error: driversError,
    reload: reloadDrivers,
  } = useAsync(() => getDriverStandings(selectedYear, 8), [selectedYear])

  const {
    data: latestRaceData,
    loading: latestLoading,
    error: latestError,
    reload: reloadLatest,
  } = useAsync(() => getLatestCompletedRace(selectedYear), [selectedYear])

  const {
    data: constructorStandings,
    loading: constrLoading,
  } = useAsync(() => getConstructorStandings(selectedYear, 10), [selectedYear])

  const isLiveSeason = selectedYear === 2026

  return (
    <PageTransition>
      <Hero />

      {/* Season Overview & Controls */}
      <section className="container-x py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-line/40 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow">{selectedYear} Championship</span>
              {isLiveSeason && (
                <span className="inline-flex items-center gap-1 rounded bg-apex/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-apex border border-apex/40 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-apex" /> Live Season
                </span>
              )}
            </div>
            <h2 className="mt-1 font-display text-3xl font-black uppercase tracking-wider text-fg">
              Season Overview
            </h2>
          </div>
          <SeasonSelector
            seasons={seasons}
            selectedYear={selectedYear}
            onSelectYear={(yr) => setSelectedYear(yr)}
          />
        </div>

        {summaryLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : summaryError ? (
          <ErrorState message={summaryError} onRetry={reloadSummary} />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Grands Prix" value={summary?.total_races} hint="Scheduled rounds" />
            <StatCard label="Completed" value={summary?.completed_races} hint="Races run" />
            <StatCard label="Drivers" value={summary?.total_drivers} hint="On the grid" />
            <StatCard label="Constructors" value={summary?.total_constructors} hint="Competing teams" />
          </div>
        )}
      </section>

      {/* Upcoming Grand Prix & Live Countdown */}
      <section className="container-x py-10">
        <SectionHeader
          eyebrow={isLiveSeason ? 'Next On The Grid' : `${selectedYear} Spotlight`}
          title={isLiveSeason ? 'Upcoming Grand Prix' : 'Featured Grand Prix'}
          to="/calendar"
          linkLabel="Full Calendar"
        />
        {upcomingLoading ? (
          <CardSkeleton />
        ) : upcomingError ? (
          <ErrorState message={upcomingError} onRetry={reloadUpcoming} />
        ) : upcomingRace ? (
          <div className="surface relative overflow-hidden p-6 md:p-8 border border-line hover:border-apex/40 transition">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-apex/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCountryFlag(upcomingRace.circuit?.country)}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-apex">
                    Round {upcomingRace.round} · {upcomingRace.season_year}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-fg">
                  {upcomingRace.name}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {upcomingRace.circuit?.name} — {upcomingRace.circuit?.location}, {upcomingRace.circuit?.country}
                </p>
                <p className="mt-1 text-xs font-mono uppercase tracking-wider text-muted/70">
                  Race Date: {upcomingRace.date} {upcomingRace.time ? `· ${upcomingRace.time} UTC` : ''}
                </p>
              </div>

              {/* Countdown Ticker for upcoming race */}
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <span className="text-xs uppercase tracking-widest text-muted">Lights Out Countdown</span>
                <RaceCountdown date={upcomingRace.date} time={upcomingRace.time} />
                <Link to="/calendar" className="btn-primary mt-2">
                  Grand Prix Hub →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="Schedule not loaded" message="No Grand Prix scheduled for this season." />
        )}
      </section>

      {/* Championship Leaders (Driver Cards with Team Themes) */}
      <section className="container-x py-10">
        <SectionHeader
          eyebrow="Title Contenders"
          title={`${selectedYear} Championship Leaders`}
          to="/drivers"
          linkLabel="All Drivers"
        />
        {driversLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : driversError ? (
          <ErrorState message={driversError} onRetry={reloadDrivers} />
        ) : topDrivers && topDrivers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topDrivers.slice(0, 4).map((standing) => {
              const flag = getCountryFlag(standing.driver.nationality)
              return (
                <div
                  key={standing.driver.driver_ref}
                  className="surface group relative p-5 transition duration-200 hover:border-apex/60"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg font-display text-xl font-black ${
                        standing.position === 1
                          ? 'bg-amber-400 text-ink shadow-md shadow-amber-400/20'
                          : standing.position === 2
                          ? 'bg-slate-300 text-ink'
                          : standing.position === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-surface/90 text-muted'
                      }`}
                    >
                      P{standing.position}
                    </span>
                    <span className="font-mono text-sm font-bold text-muted/80">
                      {standing.driver.permanent_number ? `#${standing.driver.permanent_number}` : standing.driver.code}
                    </span>
                  </div>

                  <h4 className="mt-4 font-display text-2xl font-black uppercase tracking-wide text-fg group-hover:text-apex transition-colors">
                    {standing.driver.forename} {standing.driver.surname}
                  </h4>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <span>{flag}</span>
                    <span>{standing.driver.nationality}</span>
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-line/40 pt-3">
                    <span className="font-mono text-lg font-bold text-fg">
                      {standing.points} <span className="text-xs text-muted">PTS</span>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {standing.wins} {standing.wins === 1 ? 'Win' : 'Wins'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState title="Drivers not loaded" message="No driver standings available." />
        )}
      </section>

      {/* Latest Completed Race & Podium Finishers */}
      <section className="container-x py-10">
        <SectionHeader
          eyebrow="Recent Action"
          title={`${selectedYear} Latest Race Result`}
          to="/calendar"
          linkLabel="All Results"
        />
        {latestLoading ? (
          <CardSkeleton />
        ) : latestError ? (
          <ErrorState message={latestError} onRetry={reloadLatest} />
        ) : latestRaceData ? (
          <div className="surface p-6 sm:p-8 border border-line">
            <div className="mb-6 flex flex-col justify-between border-b border-line/40 pb-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCountryFlag(latestRaceData.race.circuit?.country)}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-apex">
                    Round {latestRaceData.race.round} Podium
                  </span>
                </div>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-fg">
                  {latestRaceData.race.name}
                </h3>
              </div>
              <span className="mt-2 text-xs text-muted sm:mt-0 font-mono">
                {latestRaceData.race.circuit?.name} · {latestRaceData.race.date}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {latestRaceData.results.slice(0, 3).map((res) => {
                const theme = getTeamTheme(res.constructor?.constructor_ref)
                return (
                  <div
                    key={res.id}
                    className={`relative flex items-center justify-between rounded-lg border p-4 sm:p-5 transition ${
                      res.position === 1
                        ? 'border-amber-400/50 bg-amber-400/10 shadow-lg shadow-amber-400/5'
                        : res.position === 2
                        ? 'border-slate-300/50 bg-slate-300/10'
                        : 'border-amber-700/50 bg-amber-700/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-lg font-black ${
                          res.position === 1
                            ? 'bg-amber-400 text-ink shadow-md'
                            : res.position === 2
                            ? 'bg-slate-300 text-ink'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        P{res.position}
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold uppercase tracking-wide text-fg">
                          {res.driver?.forename} {res.driver?.surname}
                        </p>
                        <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: theme.primary }}>
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                          {res.constructor?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-fg">+{res.points} PTS</span>
                      <p className="text-[11px] text-muted font-mono">{res.time_text ?? res.status}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No results loaded" message="No race results recorded for this season yet." />
        )}
      </section>

      {/* Featured Circuits Grid */}
      <section className="container-x py-10">
        <SectionHeader eyebrow="Explore Circuits" title="Iconic Tracks" to="/circuits" linkLabel="All Circuits" />
        {circuitsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : circuitsError ? (
          <ErrorState message={circuitsError} onRetry={reloadCircuits} />
        ) : circuits && circuits.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {circuits.map((c) => {
              const flag = getCountryFlag(c.country)
              return (
                <div key={c.circuit_ref} className="surface group p-5 transition duration-200 hover:border-apex/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-muted">{c.country}</span>
                    <span className="text-lg">{flag}</span>
                  </div>
                  <h4 className="mt-2 font-display text-lg font-bold text-fg group-hover:text-apex transition-colors">
                    {c.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted">{c.location ?? '—'}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted/80 border-t border-line/30 pt-3">
                    <span className="font-mono text-[11px]">{c.latitude ? `${c.latitude.toFixed(2)}°N` : ''}</span>
                    <Link to="/circuits" className="font-semibold text-apex hover:underline">
                      View Track →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState title="Circuits not loaded" message="No circuit data available." />
        )}
      </section>

      {/* Interactive Standings Progression Tabs */}
      <section className="container-x py-10">
        <SectionHeader
          eyebrow="Championship Table"
          title={`${selectedYear} Standings`}
          to="/statistics"
          linkLabel="Full Statistics"
        />
        {driversLoading || constrLoading ? (
          <LoadingSkeleton className="h-72 w-full" />
        ) : (
          <StandingsTabs
            driverStandings={topDrivers ?? []}
            constructorStandings={constructorStandings ?? []}
          />
        )}
      </section>
    </PageTransition>
  )
}
