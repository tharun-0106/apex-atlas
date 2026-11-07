import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../utils/nav'
import Logo from './Logo'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `font-display text-lg font-semibold uppercase tracking-widest transition-colors ${
    isActive ? 'text-apex' : 'text-fg/80 hover:text-white'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="p-2 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-panel md:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={(s) => `${linkClass(s)} py-3`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
