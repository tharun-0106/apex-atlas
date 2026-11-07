interface LoadingSkeletonProps {
  className?: string
}

/** Shimmering placeholder block; size it with Tailwind classes. */
export default function LoadingSkeleton({ className = 'h-6 w-full' }: LoadingSkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function CardSkeleton() {
  return (
    <div className="surface space-y-3 p-5" role="status" aria-label="Loading">
      <LoadingSkeleton className="h-3 w-1/3" />
      <LoadingSkeleton className="h-10 w-2/3" />
      <LoadingSkeleton className="h-3 w-1/2" />
    </div>
  )
}
