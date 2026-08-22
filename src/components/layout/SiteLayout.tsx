import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { MobileActionBar } from './MobileActionBar'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout() {
  const { pathname, hash } = useLocation()
  const lastLocationRef = useRef(hash ? '' : `${pathname}${hash}`)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    const locationId = `${pathname}${hash}`
    if (lastLocationRef.current === locationId) return
    lastLocationRef.current = locationId
    let observer: MutationObserver | undefined
    const focusDestination = () => {
      if (hash) {
        let id = hash.slice(1)
        try { id = decodeURIComponent(id) } catch { /* Use the literal fragment when it is malformed. */ }
        const target = document.getElementById(id)
        if (!target) return false
        target.scrollIntoView({ block: 'start' })
        const targetHeading = target.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6')
        const focusTarget = targetHeading ?? target
        focusTarget.tabIndex = -1
        focusTarget.focus({ preventScroll: true })
        return true
      }
      const heading = main.querySelector<HTMLElement>('h1')
      if (!heading) return false
      heading.tabIndex = -1
      heading.focus()
      return true
    }

    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
    const frame = window.requestAnimationFrame(() => {
      if (focusDestination()) return
      observer = new MutationObserver(() => {
        if (focusDestination()) observer?.disconnect()
      })
      observer.observe(main, { childList: true, subtree: true })
    })
    return () => { window.cancelAnimationFrame(frame); observer?.disconnect() }
  }, [pathname, hash])
  return <><a className="skip-link" href="#main">Skip to content</a><AnnouncementBar/><SiteHeader/><main ref={mainRef} id="main"><Outlet/></main><SiteFooter/><MobileActionBar/></>
}
