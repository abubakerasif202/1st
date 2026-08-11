import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { services } from '../data/services'
import { findRouteMeta } from '../lib/routeMeta'
import NotFoundPage from './NotFoundPage'

// Deliberately generic: these describe how every movement is planned, not a
// guarantee about any individual service. Anything stronger would need to be
// verified before it could be published.
const handlingStandards = [
  'Pickup and delivery timing confirmed after route, access and freight profile review.',
  'Vehicle assignment matched to load dimensions, weight and unloading conditions.',
  'Direct contact with the operations team while the movement is in transit.',
] as const

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const service = services.find((item) => item.slug === serviceId)

  if (!service) return <NotFoundPage />

  const path = `/services/${service.slug}`
  const meta = findRouteMeta(path) ?? {
    path,
    title: `${service.title} | 1st Class Express`,
    description: service.short,
  }

  return <>
    <SeoHead title={meta.title} description={meta.description} path={path} />
    <Breadcrumbs items={[{ label: 'Services', path: '/services' }, { label: service.title }]} />
    <PageHero eyebrow="Transport Capability" title={service.title} intro={service.short} image={service.image} showBreadcrumb={false} />

    <section className="lovable-section lovable-section--soft">
      <div className="container-page detail-layout">
        <div className="detail-main">
          <div className="lovable-heading">
            <p className="lovable-kicker">Service Overview</p>
            <h2>How This Service Is Planned</h2>
          </div>
          <p>{service.detail}</p>
          <h3>Handling standards</h3>
          <ul className="premium-check-list">
            {handlingStandards.map(item => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}
          </ul>
        </div>

        <aside className="detail-aside">
          <ShieldAlert aria-hidden="true" />
          <h2>Book This Service</h2>
          <p>Send through the freight dimensions, pickup, destination and timing for {service.title.toLowerCase()} and the operations team will confirm the next step.</p>
          <Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote <ArrowRight size={16} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>

    <section className="lovable-section">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Other Services</p>
          <h2>Related Transport Support</h2>
        </div>
        <div className="lovable-service-grid">
          {services.filter(item => item.slug !== service.slug).slice(0, 4).map(({ slug, title, short, icon: Icon }) =>
            <article className="lovable-service-card" key={slug}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{short}</p>
              <Link to={`/services/${slug}`}>Service details <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>)}
        </div>
      </div>
    </section>
  </>
}
