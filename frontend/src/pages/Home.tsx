import EmptyState from '../components/EmptyState'
import Hero from '../components/Hero'
import PageTransition from '../components/PageTransition'
import SectionHeader from '../components/SectionHeader'
import StatCard from '../components/StatCard'

/*
 * Every data section below renders honest empty states until Phase 2 wires the
 * Jolpica-backed endpoints. No statistics, results or dates are hardcoded here.
 */
const PENDING = 'Live data arrives with the Jolpica integration (Phase 2).'

export default function Home() {
  return (
    <PageTransition>
      <Hero />

      <section className="container-x py-16">
        <SectionHeader eyebrow="This season" title="Season overview" to="/statistics" linkLabel="Statistics" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Grands Prix" hint="Scheduled rounds" />
          <StatCard label="Completed" hint="Races run" />
          <StatCard label="Drivers" hint="On the grid" />
          <StatCard label="Constructors" hint="Competing teams" />
        </div>
      </section>

      <section className="container-x py-12">
        <SectionHeader eyebrow="Next up" title="Upcoming Grand Prix" to="/calendar" linkLabel="Calendar" />
        <EmptyState title="Schedule not loaded" message={PENDING} />
      </section>

      <section className="container-x py-12">
        <SectionHeader eyebrow="Explore" title="Featured circuits" to="/circuits" />
        <EmptyState title="Circuits not loaded" message={PENDING} />
      </section>

      <section className="container-x py-12">
        <SectionHeader eyebrow="Meet" title="Featured drivers" to="/drivers" />
        <EmptyState title="Drivers not loaded" message={PENDING} />
      </section>

      <section className="container-x py-12">
        <SectionHeader eyebrow="Latest" title="Race results" to="/calendar" linkLabel="All results" />
        <EmptyState title="No results loaded" message={PENDING} />
      </section>

      <section className="container-x py-12">
        <SectionHeader eyebrow="Analytics" title="Statistics preview" to="/statistics" />
        <EmptyState title="Standings not loaded" message={PENDING} />
      </section>
    </PageTransition>
  )
}
