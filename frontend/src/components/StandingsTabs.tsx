import { useState } from 'react'
import { ConstructorStandingResponse, DriverStandingResponse } from '../types/api'
import { getCountryFlag } from '../utils/countryFlags'
import { getTeamTheme } from '../utils/f1Teams'

interface StandingsTabsProps {
  driverStandings: DriverStandingResponse[]
  constructorStandings: ConstructorStandingResponse[]
}

export default function StandingsTabs({ driverStandings, constructorStandings }: StandingsTabsProps) {
  const [activeTab, setActiveTab] = useState<'drivers' | 'constructors'>('drivers')

  const topDriverPoints = driverStandings.length > 0 ? driverStandings[0].points || 1 : 1
  const topConstructorPoints = constructorStandings.length > 0 ? constructorStandings[0].points || 1 : 1

  return (
    <div className="surface p-6">
      {/* Tab Switcher */}
      <div className="mb-6 flex items-center justify-between border-b border-line/40 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('drivers')}
            className={`rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'drivers'
                ? 'bg-apex text-white shadow-md shadow-apex/30'
                : 'text-muted hover:text-fg hover:bg-surface/60'
            }`}
          >
            Driver Championship
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('constructors')}
            className={`rounded px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'constructors'
                ? 'bg-apex text-white shadow-md shadow-apex/30'
                : 'text-muted hover:text-fg hover:bg-surface/60'
            }`}
          >
            Constructor Championship
          </button>
        </div>
        <span className="text-xs uppercase tracking-widest text-muted hidden sm:inline">
          {activeTab === 'drivers' ? `${driverStandings.length} Drivers Ranked` : `${constructorStandings.length} Teams`}
        </span>
      </div>

      {/* Driver Standings View */}
      {activeTab === 'drivers' && (
        <div className="space-y-3">
          {driverStandings.slice(0, 8).map((standing) => {
            const pct = Math.max(5, Math.round((standing.points / topDriverPoints) * 100))
            const flag = getCountryFlag(standing.driver.nationality)
            return (
              <div
                key={standing.driver.driver_ref}
                className="group relative flex flex-col justify-between gap-2 rounded border border-line/40 bg-surface/40 p-3 transition hover:border-line hover:bg-surface/80 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded font-display text-sm font-bold ${
                      standing.position === 1
                        ? 'bg-amber-400 text-ink shadow-sm'
                        : standing.position === 2
                        ? 'bg-slate-300 text-ink'
                        : standing.position === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-surface/90 text-muted'
                    }`}
                  >
                    {standing.position}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-fg group-hover:text-apex transition-colors">
                        {standing.driver.forename} {standing.driver.surname}
                      </span>
                      <span>{flag}</span>
                    </div>
                    <span className="text-xs text-muted font-mono">
                      {standing.driver.permanent_number ? `#${standing.driver.permanent_number}` : standing.driver.code} · {standing.wins} {standing.wins === 1 ? 'Win' : 'Wins'}
                    </span>
                  </div>
                </div>

                {/* Relative Points Progress Bar */}
                <div className="flex flex-1 items-center gap-4 sm:max-w-xs md:max-w-md">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-apex/70 to-apex transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="min-w-[70px] text-right font-mono text-sm font-bold text-fg">
                    {standing.points} <span className="text-[10px] text-muted">PTS</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Constructor Standings View */}
      {activeTab === 'constructors' && (
        <div className="space-y-3">
          {constructorStandings.slice(0, 10).map((cs) => {
            const pct = Math.max(5, Math.round((cs.points / topConstructorPoints) * 100))
            const theme = getTeamTheme(cs.constructor.constructor_ref)
            return (
              <div
                key={cs.constructor.constructor_ref}
                className="group relative flex flex-col justify-between gap-2 rounded border border-line/40 bg-surface/40 p-3 transition hover:border-line hover:bg-surface/80 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded font-display text-sm font-bold ${
                      cs.position === 1
                        ? 'bg-amber-400 text-ink shadow-sm'
                        : cs.position === 2
                        ? 'bg-slate-300 text-ink'
                        : cs.position === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-surface/90 text-muted'
                    }`}
                  >
                    {cs.position}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-fg flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                      {cs.constructor.name}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      {cs.constructor.nationality} · {cs.wins} {cs.wins === 1 ? 'Win' : 'Wins'}
                    </span>
                  </div>
                </div>

                {/* Relative Points Progress Bar */}
                <div className="flex flex-1 items-center gap-4 sm:max-w-xs md:max-w-md">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/40">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: theme.primary }}
                    />
                  </div>
                  <span className="min-w-[70px] text-right font-mono text-sm font-bold text-fg">
                    {cs.points} <span className="text-[10px] text-muted">PTS</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
