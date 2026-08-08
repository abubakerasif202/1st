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
  fleet: () => import('../pages/FleetPage'),
  serviceAreas: () => import('../pages/ServiceAreasPage'),
  book: () => import('../pages/BookNowPage'),
  contact: () => import('../pages/ContactPage'),
  careers: () => import('../pages/CareersPage'),
  driverHandbook: () => import('../pages/DriverHandbookPage'),
  notFound: () => import('../pages/NotFoundPage'),
} satisfies Record<string, () => Promise<{ default: ComponentType }>>

export type PageKey = keyof typeof pageLoaders
export type PageMap = Record<PageKey, ComponentType>
