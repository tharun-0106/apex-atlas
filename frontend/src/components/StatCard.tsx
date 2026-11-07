interface StatCardProps {
  label: string
  /** Real value from the API. When absent, an em dash is shown, never a made-up number. */
  value?: string | number | null
  hint?: string
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  const missing = value === undefined || value === null || value === ''
  return (
    <div className="surface relative overflow-hidden p-5 transition duration-200 hover:border-apex/60">
      <span className="absolute inset-y-0 left-0 w-0.5 bg-apex" aria-hidden="true" />
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className={`mt-2 font-display text-5xl font-bold ${missing ? 'text-muted/40' : 'text-fg'}`}>
        {missing ? '—' : value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}
