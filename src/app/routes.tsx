import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import routeSeo from '../data/routeSeo.json'
import type { PageMap } from './pageLoaders'

// Legacy URLs kept alive as client-side redirects; vercel.json mirrors these as
// 301s so the canonical path is what actually gets crawled.
const legacyRedirects = [
  ['/about-us', routeSeo.about.path],
  ['/our-services', routeSeo.services.path],
  ['/our-fleet', routeSeo.fleet.path],
  ['/book-now', routeSeo.book.path],
] as const

export function SiteRoutes({ pages }: { pages: PageMap }) {
  const { home: Home, about: About, services: Services, fleet: Fleet, serviceAreas: ServiceAreas, book: Book, contact: Contact, careers: Careers, driverHandbook: DriverHandbook, notFound: NotFound } = pages
  return <Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<Home />} />
      <Route path={routeSeo.about.path} element={<About />} />
      <Route path={routeSeo.services.path} element={<Services />} />
      <Route path={routeSeo.fleet.path} element={<Fleet />} />
      <Route path={routeSeo.serviceAreas.path} element={<ServiceAreas />} />
      <Route path={routeSeo.book.path} element={<Book />} />
      <Route path={routeSeo.contact.path} element={<Contact />} />
      <Route path={routeSeo.careers.path} element={<Careers />} />
      <Route path={routeSeo.driverHandbook.path} element={<DriverHandbook />} />
      {legacyRedirects.map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
}
