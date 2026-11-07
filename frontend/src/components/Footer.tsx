import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '../utils/nav'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-panel">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-md text-sm text-muted">
            Beyond the Grid. Explore Circuits. Discover Drivers. Experience Formula 1.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="font-display text-lg uppercase tracking-widest text-muted hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line py-5">
        <p className="container-x text-xs text-muted">
          Apex Atlas is an independent fan project and is not affiliated with Formula 1, the FIA or any
          team. F1 and related marks are trademarks of their respective owners.
        </p>
      </div>
    </footer>
  )
}
