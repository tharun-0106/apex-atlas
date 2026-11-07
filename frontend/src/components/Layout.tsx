import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only z-[60] bg-apex px-4 py-2 focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
      >
        Skip to content
      </a>
      <Navbar />
      <div id="content" className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
