import { CircuitSpec } from '../utils/circuitSpecs'

interface CircuitTrackMapProps {
  spec: CircuitSpec
  className?: string
}

export default function CircuitTrackMap({ spec, className = 'h-64 w-full' }: CircuitTrackMapProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-ink/90 border border-line/60 p-4 ${className}`}>
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1F2937 1px, transparent 1px), linear-gradient(to bottom, #1F2937 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Track SVG */}
      <svg
        viewBox={spec.viewBox}
        className="h-full w-full max-h-[360px] drop-shadow-[0_0_15px_rgba(225,6,0,0.2)] transition-transform duration-300"
        aria-label={`${spec.name} track map`}
      >
        <defs>
          <filter id="track-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="apex-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E10600" />
            <stop offset="100%" stopColor="#FF3B30" />
          </linearGradient>
          <linearGradient id="drs-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00FF7F" />
            <stop offset="100%" stopColor="#00D2BE" />
          </linearGradient>
        </defs>

        {/* Outer Glow */}
        <path
          d={spec.svgPath}
          fill="none"
          stroke="#E10600"
          strokeWidth="14"
          strokeOpacity="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#track-glow)"
        />

        {/* Asphalt Track Surface */}
        <path
          d={spec.svgPath}
          fill="none"
          stroke="#2A3241"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Racing Line */}
        <path
          d={spec.svgPath}
          fill="none"
          stroke="url(#apex-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 hover:stroke-white"
        />

        {/* DRS Zones Indicator Highlights */}
        {spec.drsZones > 0 && (
          <path
            d={spec.svgPath}
            fill="none"
            stroke="url(#drs-gradient)"
            strokeWidth="4"
            strokeDasharray="30 70"
            strokeLinecap="round"
            className="animate-pulse opacity-90"
          />
        )}

        {/* Start / Finish Line Marker */}
        <circle cx="100" cy="220" r="5" fill="#FFFFFF" stroke="#E10600" strokeWidth="2" />
        <text
          x="100"
          y="245"
          fill="#9CA3AF"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
        >
          START / FINISH
        </text>
      </svg>

      {/* Floating Track Badges */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
        <span className="rounded bg-ink/80 border border-line/80 px-2 py-0.5 text-[11px] font-mono text-muted">
          {spec.turns} Turns
        </span>
        <span className="rounded bg-ink/80 border border-line/80 px-2 py-0.5 text-[11px] font-mono text-muted">
          {spec.direction}
        </span>
        <span className="rounded bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-400">
          {spec.drsZones} DRS {spec.drsZones === 1 ? 'Zone' : 'Zones'}
        </span>
      </div>

      <div className="absolute top-3 right-3">
        <span className="rounded bg-ink/80 border border-line/80 px-2.5 py-1 text-xs font-mono font-bold text-fg">
          {spec.lengthKm.toFixed(3)} km
        </span>
      </div>
    </div>
  )
}
