import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { MobileActionBar } from './MobileActionBar'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout() {
  const { pathname } = useLocation()
  const initialRoute = useRef(true)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (initialRoute.current) { initialRoute.current = false; return }
    const main = mainRef.current
    if (!main) return
    let observer: MutationObserver | undefined
    const focusHeading = () => {
      const heading = main.querySelector<HTMLElement>('h1')
      if (!heading) return false
      heading.tabIndex = -1
      heading.focus()
      return true
    }
    const frame = window.requestAnimationFrame(() => {
      if (focusHeading()) return
      observer = new MutationObserver(() => {
        if (focusHeading()) observer?.disconnect()
      })
      observer.observe(main, { childList: true, subtree: true })
    })
    return () => { window.cancelAnimationFrame(frame); observer?.disconnect() }
  }, [pathname])
  return <><a className="skip-link" href="#main">Skip to content</a><AnnouncementBar/><SiteHeader/><main ref={mainRef} id="main"><Outlet/></main><SiteFooter/><MobileActionBar/></>
}
