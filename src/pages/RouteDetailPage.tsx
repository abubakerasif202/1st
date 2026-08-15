import { ArrowRight, MapPin, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { interstateRoutes } from '../data/interstateRoutes'
import { findRouteMeta } from '../lib/routeMeta'
import NotFoundPage from './NotFoundPage'

export default function RouteDetailPage() {
  const { routeId } = useParams<{ routeId: string }>()
  const route = interstateRoutes.find((item) => item.slug === routeId)

  if (!route) return <NotFoundPage />

  const path = `/service-areas/interstate/${route.slug}`
  const meta = findRouteMeta(path) ?? { path, title: `${route.title} | 1st Class Express`, description: route.description }

  const facts = [
    [MapPin, 'Origin', route.origin],
    [MapPin, 'Destination', route.destination],
    [Truck, 'Estimated transit', route.transit],
  ] as const

  return <>
    <SeoHead title={meta.title} description={meta.description} path={path} />
    <Breadcrumbs items={[{ label: 'Service Areas', path: '/service-areas' }, { label: route.title }]} />
    <PageHero eyebrow="Interstate Corridor" title={route.title} intro={route.description} image="/images/replacement/prime-mover-hero-branded.webp" showBreadcrumb={false} />

    <section className="lovable-section lovable-section--soft">
      <div className="container-page detail-layout">
        <div className="detail-main">
          <div className="lovable-heading">
            <p className="lovable-kicker">Corridor Detail</p>
            <h2>How This Route Runs</h2>
          </div>
          <dl className="detail-specs">
            {facts.map(([Icon, term, value]) => <div key={term}><dt><Icon size={16} aria-hidden="true" />{term}</dt><dd>{value}</dd></div>)}
          </dl>
          <p className="detail-note-text">Interstate movements are subject to route, freight, timing, access and compliance requirements, and are confirmed for the engagement.</p>
        </div>

        <aside className="detail-aside">
          <h2>Quote This Route</h2>
          <p>Share the pickup, destination, freight profile and preferred timing and we will confirm the route and the most suitable transport configuration.</p>
          <Link className="lovable-btn lovable-btn--primary" to={`/quote?from=${encodeURIComponent(route.origin)}&to=${encodeURIComponent(route.destination)}`}>Request a Quote <ArrowRight size={16} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>

    <section className="lovable-section">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Other Corridors</p>
          <h2>More Interstate Routes</h2>
        </div>
        <div className="lovable-feature-grid">
          {interstateRoutes.filter(item => item.slug !== route.slug).map(item =>
            <article className="lovable-feature" key={item.slug}>
              <Truck aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link className="fleet-card-link" to={`/service-areas/interstate/${item.slug}`}>View corridor <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>)}
        </div>
      </div>
    </section>
  </>
}
