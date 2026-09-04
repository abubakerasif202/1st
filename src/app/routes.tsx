import { Suspense } from 'react'
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

/**
 * The Suspense boundary lives here, not in App, because the prerenderer and the
 * browser must render the *same* tree. When only the client wrapped the routes
 * in Suspense, the server HTML had no boundary for React to match against, so
 * every page failed hydration and fell back to a full client render — throwing
 * away the prerendered DOM it had just been served.
 */
export function SiteRoutes({ pages }: { pages: PageMap }) {
  return <Suspense fallback={<div className="page-loader" role="status">Loading 1st Class Express…</div>}>
    <SiteRouteTable pages={pages} />
  </Suspense>
}

function SiteRouteTable({ pages }: { pages: PageMap }) {
  const { home: Home, about: About, services: Services, serviceDetail: ServiceDetail, fleet: Fleet, fleetDetail: FleetDetail, serviceAreas: ServiceAreas, serviceAreaDetail: ServiceAreaDetail, routeDetail: RouteDetail, book: Book, freightTerms: FreightTerms, customerApplication: CustomerApplication, quoteConfirmation: QuoteConfirmation, quoteRespond: QuoteRespond, adminSection: AdminSection, contact: Contact, careers: Careers, driverHandbook: DriverHandbook, notFound: NotFound } = pages
  return <Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<Home />} />
      <Route path={routeSeo.about.path} element={<About />} />
      <Route path={routeSeo.services.path} element={<Services />} />
      <Route path={`${routeSeo.services.path}/:serviceId`} element={<ServiceDetail />} />
      <Route path={routeSeo.fleet.path} element={<Fleet />} />
      <Route path={`${routeSeo.fleet.path}/:fleetId`} element={<FleetDetail />} />
      <Route path={routeSeo.serviceAreas.path} element={<ServiceAreas />} />
      {/* Declared before the :regionId sibling for readability; React Router
          ranks the static "interstate" segment above the dynamic one regardless. */}
      <Route path={`${routeSeo.serviceAreas.path}/interstate/:routeId`} element={<RouteDetail />} />
      <Route path={`${routeSeo.serviceAreas.path}/:regionId`} element={<ServiceAreaDetail />} />
      <Route path={routeSeo.book.path} element={<Book />} />
      <Route path={`${routeSeo.book.path}/:reference/confirmation`} element={<QuoteConfirmation />} />
      <Route path={`${routeSeo.book.path}/:reference/respond`} element={<QuoteRespond />} />
      <Route path={routeSeo.freightTerms.path} element={<FreightTerms />} />
      <Route path={routeSeo.customerApplication.path} element={<CustomerApplication />} />
      <Route path="/admin/*" element={<AdminSection />} />
      <Route path={routeSeo.contact.path} element={<Contact />} />
      <Route path={routeSeo.careers.path} element={<Careers />} />
      <Route path={routeSeo.driverHandbook.path} element={<DriverHandbook />} />
      {legacyRedirects.map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
}
