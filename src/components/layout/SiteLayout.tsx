import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { MobileActionBar } from './MobileActionBar'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return <><a className="skip-link" href="#main">Skip to content</a><AnnouncementBar/><SiteHeader/><main id="main"><Outlet/></main><SiteFooter/><MobileActionBar/></>
}
