import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useLogo } from '../lib/useLogo'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/pastors', label: 'Pastors' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/sermons', label: 'Sermons' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/prayer-request', label: 'Prayer Request' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { src: logoSrc, onError: onLogoError, exhausted: logoExhausted } = useLogo()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const solid = scrolled || open || location.pathname !== '/'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-cream/95 shadow-md backdrop-blur-sm dark:bg-brown-900/95' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          {!logoExhausted ? (
            <img
              src={logoSrc}
              alt="The Redemption Church Worldwide logo"
              onError={onLogoError}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-lg font-bold ${
                solid ? 'border-brown-500 text-brown-500' : 'border-orange-300 text-orange-200'
              }`}
            >
              RC
            </span>
          )}
          <span
            className={`font-body text-sm font-semibold leading-tight tracking-tight sm:text-base ${
              solid ? 'text-brown-700 dark:text-cream' : 'text-cream'
            }`}
          >
            The
            <br />
            Redemption Church
            <br />
            <span className={`eyebrow text-[10px] tracking-widest ${solid ? 'text-orange-500' : 'text-orange-200'}`}>
              Worldwide
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `eyebrow text-[11px] transition-colors hover:text-orange-500 ${
                  isActive ? 'text-orange-500' : solid ? 'text-brown-600 dark:text-cream/80' : 'text-cream/90'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark(!dark)}
            className={`rounded-full p-2 transition-colors ${
              solid ? 'text-brown-600 hover:bg-brown-50' : 'text-cream hover:bg-white/10'
            }`}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/give"
            className="hidden rounded-full bg-give-500 px-5 py-2 eyebrow text-[11px] text-white transition-transform hover:scale-105 hover:bg-give-400 sm:inline-block"
          >
            Give
          </Link>
          <button
            aria-label="Toggle menu"
            className={`lg:hidden ${solid ? 'text-brown-700 dark:text-cream' : 'text-cream'}`}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brown-100 bg-cream px-6 py-4 dark:bg-brown-900 lg:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-3 font-body text-sm text-brown-700 hover:bg-brown-50 dark:text-cream/90"
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/give"
            className="mt-2 rounded-full bg-give-500 px-5 py-3 text-center eyebrow text-[11px] text-white"
          >
            Give
          </Link>
        </nav>
      )}
    </header>
  )
}
