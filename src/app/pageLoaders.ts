import type { ComponentType } from 'react'

// One route table, two consumers: the browser wraps each loader in React.lazy so
// pages stay code-split, while the prerenderer awaits every loader up front and
// renders the same tree eagerly (React.lazy would only emit the Suspense
// fallback into the static HTML).
//
// Kept apart from routes.tsx so that file only exports components and React Fast
// Refresh keeps working.
export const pageLoaders = {
  home: () => import('../pages/HomePage'),
  about: () => import('../pages/AboutPage'),
  services: () => import('../pages/ServicesPage'),
  serviceDetail: () => import('../pages/ServiceDetailPage'),
  fleet: () => import('../pages/FleetPage'),
  fleetDetail: () => import('../pages/FleetDetailPage'),
  serviceAreas: () => import('../pages/ServiceAreasPage'),
  serviceAreaDetail: () => import('../pages/ServiceAreaDetailPage'),
  routeDetail: () => import('../pages/RouteDetailPage'),
  book: () => import('../pages/BookNowPage'),
  freightTerms: () => import('../pages/FreightTermsPage'),
  quoteConfirmation: () => import('../pages/QuoteConfirmationPage'),
  quoteRespond: () => import('../pages/QuoteRespondPage'),
  contact: () => import('../pages/ContactPage'),
  careers: () => import('../pages/CareersPage'),
  driverHandbook: () => import('../pages/DriverHandbookPage'),
  notFound: () => import('../pages/NotFoundPage'),
} satisfies Record<string, () => Promise<{ default: ComponentType }>>

export type PageKey = keyof typeof pageLoaders
export type PageMap = Record<PageKey, ComponentType>

// Longest-prefix-first. Mirrors routes.tsx; the route test asserts every
// routeSeo path resolves here to the same page the router picks.
const pathMatchers: [RegExp, PageKey][] = [
  [/^\/$/, 'home'],
  [/^\/(about|about-us)$/, 'about'],
  [/^\/(services|our-services)$/, 'services'],
  [/^\/services\/[^/]+$/, 'serviceDetail'],
  [/^\/(fleet|our-fleet)$/, 'fleet'],
  [/^\/fleet\/[^/]+$/, 'fleetDetail'],
  [/^\/service-areas$/, 'serviceAreas'],
  [/^\/service-areas\/interstate\/[^/]+$/, 'routeDetail'],
  [/^\/service-areas\/[^/]+$/, 'serviceAreaDetail'],
  [/^\/quote\/[^/]+\/confirmation$/, 'quoteConfirmation'],
  [/^\/quote\/[^/]+\/respond$/, 'quoteRespond'],
  [/^\/(quote|book-now)$/, 'book'],
  [/^\/freight-terms$/, 'freightTerms'],
  [/^\/contact$/, 'contact'],
  [/^\/careers$/, 'careers'],
  [/^\/driver-handbook$/, 'driverHandbook'],
]

/** The page key a pathname will render, so the chunk can be fetched up front. */
export function pageKeyForPath(pathname: string): PageKey {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return pathMatchers.find(([pattern]) => pattern.test(path))?.[1] ?? 'notFound'
}

/**
 * Warms the chunk for the current URL before hydration. Without this, every
 * prerendered document suspends the moment it hydrates and React swaps the
 * server-rendered content for the Suspense fallback until the chunk arrives —
 * a visible flash of "Loading…" over content the browser already had.
 */
export function preloadPageForPath(pathname: string): Promise<unknown> {
  return pageLoaders[pageKeyForPath(pathname)]()
}
