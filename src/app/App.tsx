import { lazy, Suspense } from 'react'
import type { PageMap } from './routes'
import { pageLoaders, SiteRoutes } from './routes'

// Listed key by key rather than mapped: PageMap requires every PageKey, so
// adding a loader without wiring it up here is a compile error.
const pages: PageMap = {
  home: lazy(pageLoaders.home),
  about: lazy(pageLoaders.about),
  services: lazy(pageLoaders.services),
  fleet: lazy(pageLoaders.fleet),
  serviceAreas: lazy(pageLoaders.serviceAreas),
  book: lazy(pageLoaders.book),
  contact: lazy(pageLoaders.contact),
  careers: lazy(pageLoaders.careers),
  driverHandbook: lazy(pageLoaders.driverHandbook),
  notFound: lazy(pageLoaders.notFound),
}

export default function App() {
  return <Suspense fallback={<div className="page-loader" role="status">Loading 1st Class Express…</div>}>
    <SiteRoutes pages={pages} />
  </Suspense>
}
