import { getHealth } from '../services/healthService'
import { useAsync } from '../hooks/useAsync'
import LoadingSkeleton from './LoadingSkeleton'

/** Live indicator proving frontend ↔ backend ↔ database connectivity. */
export default function ApiStatus() {
  const { data, error, loading, reload } = useAsync(getHealth)

  if (loading) return <LoadingSkeleton className="h-5 w-44" />

  const online = !error && data
  const dbUp = data?.database === 'up'
  const color = !online ? 'bg-apex' : dbUp ? 'bg-emerald-500' : 'bg-amber-400'
  const label = !online ? 'API offline' : dbUp ? 'API & database online' : 'API online · database unreachable'

  return (
    <button
      type="button"
      onClick={reload}
      title={error ?? `${data?.service} v${data?.version} (${data?.environment}). Click to re-check.`}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted hover:text-white"
    >
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
      {label}
    </button>
  )
}
