import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { QUOTE_CTA } from '../lib/cta'
import { ResponsiveImage } from '../components/common/ResponsiveImage'
import { SeoHead } from '../components/common/SeoHead'
import { fleet } from '../data/fleet'
import { findRouteMeta } from '../lib/routeMeta'
import NotFoundPage from './NotFoundPage'

export default function FleetDetailPage() {
  const { fleetId } = useParams<{ fleetId: string }>()
  const vehicle = fleet.find((item) => item.slug === fleetId)

  if (!vehicle) return <NotFoundPage />

  const path = `/fleet/${vehicle.slug}`
  const meta = findRouteMeta(path) ?? {
    path,
    title: `${vehicle.title} | 1st Class Express Fleet`,
    description: `${vehicle.title}: ${vehicle.use} Best for ${vehicle.bestFor.toLowerCase()}.`,
  }

  const specifications = [
    ['Best for', vehicle.bestFor],
    ['Service type', vehicle.serviceType],
    ['Availability', vehicle.availability],
    ['Freight capability', vehicle.capability],
    ['Category', vehicle.category],
  ] as const

  return <>
    <SeoHead title={meta.title} description={meta.description} path={path} />
    <Breadcrumbs items={[{ label: 'Our Fleet', path: '/fleet' }, { label: vehicle.title }]} />
    <PageHero eyebrow={vehicle.category} title={vehicle.title} intro={vehicle.use} image={vehicle.image} showBreadcrumb={false} cta={QUOTE_CTA} />

    <section className="lovable-section lovable-section--soft">
      <div className="container-page detail-layout">
        <div className="detail-main">
          <div className="lovable-heading">
            <p className="lovable-kicker">Vehicle Detail</p>
            <h2>Capability And Suitability</h2>
          </div>
          <dl className="detail-specs">
            {specifications.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
          </dl>
          <p className="detail-note-text">Final vehicle selection is confirmed after the freight, access and route are assessed for the booking.</p>
        </div>

        <aside className="detail-aside">
          <h2>Book This Vehicle</h2>
          <p>Tell us what needs moving and where. We will confirm whether {vehicle.title.toLowerCase()} suit the job, or recommend the configuration that does.</p>
          <Link className="lovable-btn lovable-btn--primary" to={`/quote?vehicle=${encodeURIComponent(vehicle.title)}`}>Request a Quote <ArrowRight size={16} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>

    <section className="lovable-section">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Rest Of The Fleet</p>
          <h2>Other Vehicle Types</h2>
        </div>
        <div className="lovable-fleet-grid">
          {fleet.filter(item => item.slug !== vehicle.slug).slice(0, 3).map(({ slug, title, use, image }) =>
            <article className="lovable-fleet-card" key={slug}>
              <ResponsiveImage src={image} alt={`1st Class Express ${title}`} sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"/>
              <div className="lovable-fleet-card__copy">
                <h3>{title}</h3>
                <p>{use}</p>
                <Link className="fleet-card-link" to={`/fleet/${slug}`}>View details <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </article>)}
        </div>
      </div>
    </section>
  </>
}
