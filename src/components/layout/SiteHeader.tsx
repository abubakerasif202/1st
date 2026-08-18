import { ArrowRight, Menu, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { company, phoneHref } from '../../data/company'

const links = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Services', '/services'],
  ['Our Fleet', '/fleet'],
  ['Service Areas', '/service-areas'],
  ['Careers', '/careers'],
  ['Contact', '/contact'],
] as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const opener = openerRef.current
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key !== 'Tab') return

      const panel = document.getElementById('mobile-menu')
      const focusable = panel?.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [open])

  const mobileMenu = open && typeof document !== 'undefined'
    ? createPortal(
        <div
          className="mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
          style={{ zIndex: 10000 }}
        >
          <div
            className="mobile-panel"
            id="mobile-menu"
            style={{
              background: '#10171d',
              color: '#fff',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <button
              ref={closeRef}
              className="menu-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X aria-hidden="true" />
            </button>

            <img
              src="/brand/first-class-express-logo.webp"
              alt="1st Class Express"
              width="150"
              height="163"
            />

            <nav aria-label="Mobile primary">
              {links.map(([label, to]) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              ))}
            </nav>

            {/*
              The desktop .header-cta is display:none below 820px, so before this
              the drawer offered no conversion emphasis at all — "Request a Quote"
              was the eighth identical nav row. Pinned to the end of the panel so
              both actions sit in comfortable thumb reach.
            */}
            <div className="mobile-panel__actions">
              <NavLink className="lovable-btn lovable-btn--primary" to="/quote" onClick={() => setOpen(false)}>
                Request a Quote
                <ArrowRight size={18} aria-hidden="true" />
              </NavLink>
              <a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}>
                <Phone size={18} aria-hidden="true" />
                Call {company.phonePrimary}
              </a>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <>
      <header className="site-header">
        <div className="container-page header-inner">
          <NavLink className="brand" to="/" aria-label="1st Class Express home">
            <img
              src="/brand/first-class-express-logo.webp"
              alt="1st Class Express"
              width="138"
              height="150"
            />
          </NavLink>

          <nav className="desktop-nav" aria-label="Primary">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <a
            className="header-phone"
            href={phoneHref(company.phonePrimary)}
            aria-label={`Call ${company.phonePrimary}`}
          >
            <Phone size={17} aria-hidden="true" />
          </a>

          <NavLink to="/quote" className="header-cta">
            Request a Quote
          </NavLink>

          <button
            ref={openerRef}
            className="menu-button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>
      {mobileMenu}
    </>
  )
}
