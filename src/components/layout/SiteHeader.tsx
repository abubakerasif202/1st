import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  ['Home', '/'], ['About Us', '/about-us'], ['Our Services', '/our-services'], ['Our Fleet', '/our-fleet'], ['Contact', '/contact'],
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
      const focusable = panel?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); opener?.focus() }
  }, [open])
  return <header className="site-header"><div className="container-page header-inner">
    <NavLink className="brand" to="/" aria-label="1st Class Express home"><img src="/brand/first-class-express-logo.png" alt="1st Class Express" width="138" height="150" /></NavLink>
    <nav className="desktop-nav" aria-label="Primary">{links.map(([label, to]) => <NavLink key={to} to={to} className={({isActive}) => isActive ? 'active' : ''}>{label}</NavLink>)}</nav>
    <NavLink to="/book-now" className="header-cta">Book Now</NavLink>
    <button ref={openerRef} className="menu-button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu"><Menu /></button>
  </div>
  {open && <div className="mobile-overlay" role="dialog" aria-modal="true" aria-label="Mobile navigation"><div className="mobile-panel" id="mobile-menu">
    <button ref={closeRef} className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
    <img src="/brand/first-class-express-logo.png" alt="" width="150" height="163" />
    <nav aria-label="Mobile primary">{links.map(([label, to]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}<NavLink to="/book-now" onClick={() => setOpen(false)}>Book Now</NavLink></nav>
  </div></div>}
  </header>
}
