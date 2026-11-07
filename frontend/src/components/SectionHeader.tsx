import { Link } from 'react-router-dom'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  to?: string
  linkLabel?: string
}

export default function SectionHeader({ eyebrow, title, to, linkLabel }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-2">{title}</h2>
      </div>
      {to && (
        <Link
          to={to}
          className="hidden font-display text-base font-semibold uppercase tracking-widest text-muted transition hover:text-apex sm:block"
        >
          {linkLabel ?? 'View all'} →
        </Link>
      )}
    </div>
  )
}
