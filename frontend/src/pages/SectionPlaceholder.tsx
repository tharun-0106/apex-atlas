import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

interface SectionPlaceholderProps {
  eyebrow: string
  title: string
  description: string
  phase: string
}

/** Shared shell for sections that are routed now but built in later phases. */
export default function SectionPlaceholder({ eyebrow, title, description, phase }: SectionPlaceholderProps) {
  return (
    <PageTransition>
      <section className="container-x pb-12 pt-32">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-none sm:text-8xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{description}</p>
        <p className="mt-8 inline-block border border-line bg-card px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
          Planned for {phase}
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-ghost">
            ← Back home
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
