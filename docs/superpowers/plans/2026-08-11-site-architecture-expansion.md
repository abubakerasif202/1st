# Site Architecture Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand First Class Express site architecture from a flat 8-page showcase into a rich 3-level site with deep service detail pages, fleet category pages, route/corridor pages, structured dropdown navigation, and breadcrumb trails.

**Architecture:** Extend React Router paths in `src/app/App.tsx` with dynamic sub-routes (`/services/:serviceId`, `/fleet/:fleetId`, `/service-areas/*`), add comprehensive metadata into `src/data/routeSeo.json`, build reusable detail page templates with tailored content components, update Header/Footer navigation to include dropdown sub-menus, and add schema-backed breadcrumbs across all L2/L3 pages.

**Tech Stack:** React 18, React Router DOM v7, TypeScript, Lucide React, Vite, Vitest.

---

### Task 1: Expand SEO Route Data (`src/data/routeSeo.json`)

**Files:**
- Modify: `src/data/routeSeo.json`

- [ ] **Step 1: Add new sub-route SEO metadata to `routeSeo.json`**

Update `src/data/routeSeo.json` to include titles, paths, and meta descriptions for sub-services, fleet categories, and interstate routes.

```json
{
  "home": {
    "path": "/",
    "title": "1st Class Express | Freight, Drivers & Fleet Solutions",
    "description": "Professional freight delivery, dedicated driver and managed fleet solutions across Sydney and interstate Australia."
  },
  "about": {
    "path": "/about",
    "title": "About 1st Class Express | Australian Transport Company",
    "description": "Learn about 1st Class Express, an Australian-owned transport company providing professional freight delivery, dedicated drivers and fleet solutions across Sydney and interstate routes."
  },
  "services": {
    "path": "/services",
    "title": "Freight, Driver & Fleet Services | 1st Class Express",
    "description": "Explore metropolitan delivery, interstate linehaul, dedicated driver, dangerous-goods assessment and managed fleet services from 1st Class Express."
  },
  "serviceDetail": {
    "path": "/services/:serviceId"
  },
  "fleet": {
    "path": "/fleet",
    "title": "Our Fleet | Trucks, Drivers & Managed Fleet Solutions",
    "description": "Explore vans, pallet trucks, rigid trucks, prime movers, semi-trailers and B-double configurations from 1st Class Express across Sydney and interstate routes."
  },
  "fleetDetail": {
    "path": "/fleet/:fleetId"
  },
  "serviceAreas": {
    "path": "/service-areas",
    "title": "Freight Service Areas | 1st Class Express",
    "description": "Freight transport across Sydney, regional NSW, Canberra and interstate routes between major Australian destinations."
  },
  "routeDetail": {
    "path": "/service-areas/interstate/:routeId"
  },
  "book": {
    "path": "/quote",
    "title": "Request a Freight Quote | 1st Class Express",
    "description": "Request a freight quote from 1st Class Express for local, linehaul and interstate transport across Australia."
  },
  "contact": {
    "path": "/contact",
    "title": "Contact 1st Class Express | Freight Enquiries",
    "description": "Contact 1st Class Express for local, regional and interstate freight enquiries across Australia."
  },
  "careers": {
    "path": "/careers",
    "title": "Driver Careers | 1st Class Express",
    "description": "View available driving roles and apply for local or interstate driving opportunities with 1st Class Express, an Australian transport company."
  },
  "notFound": {
    "path": "/404",
    "title": "Page Not Found | 1st Class Express",
    "description": "The requested page could not be found."
  }
}
```

- [ ] **Step 2: Run typecheck to verify JSON validity**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/data/routeSeo.json
git commit -m "feat(seo): add extended route definitions to routeSeo.json"
```

---

### Task 2: Create Breadcrumbs Component (`src/components/common/Breadcrumbs.tsx`)

**Files:**
- Create: `src/components/common/Breadcrumbs.tsx`
- Test: `src/test/Breadcrumbs.test.tsx`

- [ ] **Step 1: Write test for Breadcrumbs component**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Breadcrumbs } from '../components/common/Breadcrumbs'

describe('Breadcrumbs Component', () => {
  it('renders breadcrumb items correctly', () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Services', path: '/services' },
      { label: 'Dangerous Goods Transport' },
    ]
    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Dangerous Goods Transport')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL (Cannot find module Breadcrumbs)

- [ ] **Step 3: Implement `Breadcrumbs.tsx`**

```tsx
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-900/60 border-b border-slate-800 py-3 text-xs sm:text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center flex-wrap gap-1.5">
        <Link to="/" className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span className="sr-only">Home</span>
        </Link>
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-amber-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-200 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/common/Breadcrumbs.tsx src/test/Breadcrumbs.test.tsx
git commit -m "feat(ui): add Breadcrumbs component with unit test"
```

---

### Task 3: Create Service Detail Page (`src/pages/ServiceDetailPage.tsx`)

**Files:**
- Create: `src/pages/ServiceDetailPage.tsx`

- [ ] **Step 1: Build `ServiceDetailPage.tsx` with dynamic matching for service IDs**

Create `src/pages/ServiceDetailPage.tsx` to handle individual service detail views (e.g. `/services/same-day`, `/services/dangerous-goods`, `/services/interstate`) with hero, key specs, capability checklist, fleet compatibility, and route quote CTA.

```tsx
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { services } from '../data/services'
import NotFoundPage from './NotFoundPage'

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const service = services.find((s) => s.id === serviceId)

  if (!service) {
    return <NotFoundPage />
  }

  return (
    <>
      <SeoHead
        title={`${service.title} | 1st Class Express Freight`}
        description={service.short}
        path={`/services/${service.id}`}
      />
      <Breadcrumbs
        items={[
          { label: 'Services', path: '/services' },
          { label: service.title },
        ]}
      />
      <PageHero
        eyebrow="Transport Capability"
        title={service.title}
        intro={service.short}
        image={service.image}
      />
      <section className="lovable-section lovable-section--soft">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">Service Overview</h2>
                <p className="text-slate-300 leading-relaxed mb-6">{service.detail}</p>

                <h3 className="text-lg font-semibold text-amber-400 mb-3">Key Handling Standards</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Pickup and delivery timing confirmed after route, access, and freight profile review.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Compliant vehicle assignment tailored to load dimensions, weight, and unloading conditions.</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Direct linehaul communication and tracking updates throughout transit.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                <ShieldAlert className="w-8 h-8 text-amber-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-100 mb-2">Book This Service</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Ready to arrange pickup for {service.title}? Submit your freight dimensions and destination for an immediate quote.
                </p>
                <Link
                  to="/quote"
                  className="lovable-btn lovable-btn--primary w-full justify-center"
                >
                  Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Run typecheck to verify component compiles**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/ServiceDetailPage.tsx
git commit -m "feat(pages): add ServiceDetailPage component"
```

---

### Task 4: Create Fleet & Route Detail Pages (`src/pages/FleetDetailPage.tsx` & `src/pages/RouteDetailPage.tsx`)

**Files:**
- Create: `src/pages/FleetDetailPage.tsx`
- Create: `src/pages/RouteDetailPage.tsx`

- [ ] **Step 1: Create `FleetDetailPage.tsx`**

```tsx
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { fleet } from '../data/fleet'
import NotFoundPage from './NotFoundPage'

export default function FleetDetailPage() {
  const { fleetId } = useParams<{ fleetId: string }>()
  // Match slugified title
  const item = fleet.find(
    (f) => f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === fleetId
  )

  if (!item) {
    return <NotFoundPage />
  }

  return (
    <>
      <SeoHead
        title={`${item.title} | 1st Class Express Fleet`}
        description={`${item.title}: ${item.use} Best for ${item.bestFor}.`}
        path={`/fleet/${fleetId}`}
      />
      <Breadcrumbs
        items={[
          { label: 'Fleet', path: '/fleet' },
          { label: item.title },
        ]}
      />
      <PageHero
        eyebrow={item.category}
        title={item.title}
        intro={item.use}
        image={item.image}
      />
      <section className="lovable-section lovable-section--soft">
        <div className="container-page">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 max-w-3xl">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Vehicle Specifications & Capabilities</h2>
            <div className="space-y-4 text-slate-300">
              <p><strong className="text-amber-400">Best For:</strong> {item.bestFor}</p>
              <p><strong className="text-amber-400">Service Type:</strong> {item.serviceType}</p>
              <p><strong className="text-amber-400">Availability:</strong> {item.availability}</p>
            </div>
            <div className="mt-8">
              <Link to="/quote" className="lovable-btn lovable-btn--primary">
                Book This Vehicle <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Create `RouteDetailPage.tsx`**

```tsx
import { ArrowRight, MapPin, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import NotFoundPage from './NotFoundPage'

const routesData: Record<string, { title: string; origin: string; dest: string; transit: string; description: string }> = {
  'sydney-melbourne': {
    title: 'Sydney to Melbourne Freight Linehaul',
    origin: 'Sydney, NSW',
    dest: 'Melbourne, VIC',
    transit: 'Overnight / Next-Day',
    description: 'Scheduled daily linehaul corridor connecting Sydney and Melbourne metropolitan hubs for palletised, bulk, and B-double freight.'
  },
  'sydney-brisbane': {
    title: 'Sydney to Brisbane Freight Linehaul',
    origin: 'Sydney, NSW',
    dest: 'Brisbane, QLD',
    transit: '24–36 Hours',
    description: 'Express interstate corridor servicing Sydney to Brisbane commercial freight, regional drops, and manufacturing runs.'
  },
  'sydney-canberra': {
    title: 'Sydney to Canberra Freight Linehaul',
    origin: 'Sydney, NSW',
    dest: 'Canberra, ACT',
    transit: 'Same-Day / Overnight',
    description: 'Frequent linehaul service between Sydney and Canberra for commercial freight, government deliveries, and express cargo.'
  }
}

export default function RouteDetailPage() {
  const { routeId } = useParams<{ routeId: string }>()
  const routeInfo = routeId ? routesData[routeId] : undefined

  if (!routeInfo) {
    return <NotFoundPage />
  }

  return (
    <>
      <SeoHead
        title={`${routeInfo.title} | 1st Class Express`}
        description={routeInfo.description}
        path={`/service-areas/interstate/${routeId}`}
      />
      <Breadcrumbs
        items={[
          { label: 'Service Areas', path: '/service-areas' },
          { label: 'Interstate', path: '/service-areas' },
          { label: routeInfo.title },
        ]}
      />
      <PageHero
        eyebrow="Interstate Corridor"
        title={routeInfo.title}
        intro={routeInfo.description}
        image="/images/replacement/prime-mover-hero-branded.png"
      />
      <section className="lovable-section lovable-section--soft">
        <div className="container-page max-w-4xl">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 space-y-6">
            <div className="flex flex-wrap gap-6 text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span><strong>Origin:</strong> {routeInfo.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span><strong>Destination:</strong> {routeInfo.dest}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span><strong>Estimated Transit:</strong> {routeInfo.transit}</span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">{routeInfo.description}</p>
            <div className="pt-4">
              <Link to="/quote" className="lovable-btn lovable-btn--primary">
                Get a Route Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Run typecheck to verify compilation**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/pages/FleetDetailPage.tsx src/pages/RouteDetailPage.tsx
git commit -m "feat(pages): add FleetDetailPage and RouteDetailPage components"
```

---

### Task 5: Register Extended Routes in Router (`src/app/App.tsx`)

**Files:**
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Update `App.tsx` to include dynamic detail routes**

Update `src/app/App.tsx` lazy imports and router declarations to render detail routes.

```tsx
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import routeSeo from '../data/routeSeo.json'

const HomePage = lazy(() => import('../pages/HomePage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ServicesPage = lazy(() => import('../pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('../pages/ServiceDetailPage'))
const FleetPage = lazy(() => import('../pages/FleetPage'))
const FleetDetailPage = lazy(() => import('../pages/FleetDetailPage'))
const ServiceAreasPage = lazy(() => import('../pages/ServiceAreasPage'))
const RouteDetailPage = lazy(() => import('../pages/RouteDetailPage'))
const BookNowPage = lazy(() => import('../pages/BookNowPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const CareersPage = lazy(() => import('../pages/CareersPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<div className="page-loader" role="status">Loading 1st Class Express…</div>}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path={routeSeo.about.path} element={<AboutPage />} />
          <Route path={routeSeo.services.path} element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path={routeSeo.fleet.path} element={<FleetPage />} />
          <Route path="/fleet/:fleetId" element={<FleetDetailPage />} />
          <Route path={routeSeo.serviceAreas.path} element={<ServiceAreasPage />} />
          <Route path="/service-areas/interstate/:routeId" element={<RouteDetailPage />} />
          <Route path={routeSeo.book.path} element={<BookNowPage />} />
          <Route path={routeSeo.contact.path} element={<ContactPage />} />
          <Route path={routeSeo.careers.path} element={<CareersPage />} />

          {/* Legacy Redirects */}
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/our-services" element={<Navigate to="/services" replace />} />
          <Route path="/our-fleet" element={<Navigate to="/fleet" replace />} />
          <Route path="/book-now" element={<Navigate to="/quote" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
```

- [ ] **Step 2: Run typecheck to verify routes build without TypeScript errors**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/App.tsx
git commit -m "feat(router): map service, fleet, and route detail paths in App.tsx"
```

---

### Task 6: Prerender & Build Verification

**Files:**
- Modify/Verify: `scripts/prerender-routes.mjs` (if applicable)

- [ ] **Step 1: Run full test suite and build pipeline**

Run: `npm run build`
Expected: Successful Vite build and static route prerendering without errors.

- [ ] **Step 2: Run lint check**

Run: `npm run lint`
Expected: PASS (0 warnings)

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore(build): verify full site build and prerender pipeline"
```
