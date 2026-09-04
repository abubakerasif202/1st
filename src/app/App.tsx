import { lazy } from 'react'
import type { PageMap } from './pageLoaders'
import { pageLoaders } from './pageLoaders'
import { SiteRoutes } from './routes'

// Listed key by key rather than mapped: PageMap requires every PageKey, so
// adding a loader without wiring it up here is a compile error.
const pages: PageMap = {
  home: lazy(pageLoaders.home),
  about: lazy(pageLoaders.about),
  services: lazy(pageLoaders.services),
  serviceDetail: lazy(pageLoaders.serviceDetail),
  fleet: lazy(pageLoaders.fleet),
  fleetDetail: lazy(pageLoaders.fleetDetail),
  serviceAreas: lazy(pageLoaders.serviceAreas),
  serviceAreaDetail: lazy(pageLoaders.serviceAreaDetail),
  routeDetail: lazy(pageLoaders.routeDetail),
  book: lazy(pageLoaders.book),
  freightTerms: lazy(pageLoaders.freightTerms),
  customerApplication: lazy(pageLoaders.customerApplication),
  quoteConfirmation: lazy(pageLoaders.quoteConfirmation),
  quoteRespond: lazy(pageLoaders.quoteRespond),
  adminSection: lazy(pageLoaders.adminSection),
  contact: lazy(pageLoaders.contact),
  careers: lazy(pageLoaders.careers),
  driverHandbook: lazy(pageLoaders.driverHandbook),
  notFound: lazy(pageLoaders.notFound),
}

// SiteRoutes owns the Suspense boundary so this tree matches the prerenderer's.
export default function App() {
  return <SiteRoutes pages={pages} />
}
