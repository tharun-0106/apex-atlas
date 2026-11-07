import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Apex Atlas home">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" fill="#E10600" />
        <path d="M16 6 7 26h4.4l1.5-3.6h6.2l1.5 3.6H25L16 6Zm0 8.6 2.1 5H13.9l2.1-5Z" fill="#fff" />
      </svg>
      <span className="font-display text-2xl font-bold uppercase leading-none tracking-wider">
        Apex<span className="text-apex"> Atlas</span>
      </span>
    </Link>
  )
}
