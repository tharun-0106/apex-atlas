interface SeasonSelectorProps {
  seasons: number[]
  selectedYear: number
  onSelectYear: (year: number) => void
}

export default function SeasonSelector({ seasons, selectedYear, onSelectYear }: SeasonSelectorProps) {
  const currentSeason = seasons.length > 0 ? seasons[0] : 2026

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-muted hidden sm:inline">Season:</span>
      <div className="relative inline-block">
        <select
          value={selectedYear}
          onChange={(e) => onSelectYear(Number(e.target.value))}
          className="appearance-none cursor-pointer rounded border border-line bg-surface/90 py-1.5 pl-3 pr-8 text-xs font-semibold uppercase tracking-wider text-fg transition hover:border-apex/60 focus:border-apex focus:outline-none"
        >
          {seasons.map((year) => (
            <option key={year} value={year} className="bg-surface text-fg py-1">
              {year} {year === currentSeason ? '• Live Grid' : ''}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
