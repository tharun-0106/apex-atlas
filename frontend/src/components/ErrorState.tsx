interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export default function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="surface border-apex/40 p-6" role="alert">
      <p className="font-display text-xl font-bold uppercase tracking-wider text-apex">{title}</p>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost mt-4 !py-2">
          Try again
        </button>
      )}
    </div>
  )
}
