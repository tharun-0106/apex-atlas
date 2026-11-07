import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApiStatus from './ApiStatus'

/** Decorative speed lines. Purely abstract; no real track geometry is implied. */
function SpeedLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-60"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="streak" x1="0" x2="1">
          <stop offset="0" stopColor="#E10600" stopOpacity="0" />
          <stop offset="0.7" stopColor="#E10600" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {[140, 210, 262, 330, 388, 452, 520, 584].map((y, i) => (
        <rect
          key={y}
          x={120 + ((i * 97) % 380)}
          y={y}
          width={260 + ((i * 53) % 340)}
          height={i % 3 === 0 ? 2.5 : 1.2}
          fill="url(#streak)"
          transform={`skewX(-28) translate(${y * 0.52} 0)`}
        />
      ))}
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden pb-0 pt-32">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 75% 35%, rgba(225,6,0,0.22), transparent 60%), linear-gradient(180deg, #161D29 0%, #101319 100%)',
        }}
      />
      {/* Lines fade out toward the left so they never cross the headline or buttons. */}
      <div
        className="absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_right,transparent_45%,black_85%)] [-webkit-mask-image:linear-gradient(to_right,transparent_45%,black_85%)]"
        aria-hidden="true"
      >
        <SpeedLines />
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-x pb-20 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="eyebrow"
        >
          Formula 1 · Explore · Compare · Discover
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 font-display text-[4.2rem] font-extrabold uppercase leading-[0.88] tracking-tight sm:text-[7rem] lg:text-[9.5rem]"
        >
          Beyond
          <br />
          the <span className="text-apex [text-shadow:0_0_48px_rgba(225,6,0,0.55)]">Grid.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-xl text-lg text-muted"
        >
          Explore Circuits. Discover Drivers. Experience Formula 1.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link to="/circuits" className="btn-primary">
            Explore Circuits
          </Link>
          <Link to="/drivers" className="btn-ghost">
            Meet the Drivers
          </Link>
        </motion.div>

        <div className="mt-12">
          <ApiStatus />
        </div>
      </div>
    </section>
  )
}
