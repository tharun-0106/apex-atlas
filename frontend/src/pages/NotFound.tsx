import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <section className="container-x pb-12 pt-32">
        <p className="eyebrow">Off track</p>
        <h1 className="mt-3 font-display text-7xl font-extrabold uppercase leading-none sm:text-9xl">404</h1>
        <p className="mt-6 text-lg text-muted">That page doesn&apos;t exist.</p>
        <Link to="/" className="btn-primary mt-8">
          Back to the grid
        </Link>
      </section>
    </PageTransition>
  )
}
