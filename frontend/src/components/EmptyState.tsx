interface EmptyStateProps {
  title: string
  message: string
}

/** Honest placeholder for sections whose real data has not been wired up yet. */
export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-line bg-panel/60 p-8 text-center">
      <p className="font-display text-xl font-semibold uppercase tracking-widest text-fg/80">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{message}</p>
    </div>
  )
}
