import { ArrowRight, CheckCircle2, MapPinned } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { QUOTE_CTA } from '../lib/cta'
import { SeoHead } from '../components/common/SeoHead'
import { interstateRoutes } from '../data/interstateRoutes'
import { serviceRegions } from '../data/serviceRegions'
import { findRouteMeta } from '../lib/routeMeta'
import NotFoundPage from './NotFoundPage'

export default function ServiceAreaDetailPage() {
  const { regionId } = useParams<{ regionId: string }>()
  const region = serviceRegions.find((item) => item.slug === regionId)

  if (!region) return <NotFoundPage />

  const path = `/service-areas/${region.slug}`
  const meta = findRouteMeta(path) ?? { path, title: `${region.title} | 1st Class Express`, description: region.intro }

  return <>
    <SeoHead title={meta.title} description={meta.description} path={path} />
    <Breadcrumbs items={[{ label: 'Service Areas', path: '/service-areas' }, { label: region.eyebrow }]} />
    <PageHero eyebrow={region.eyebrow} title={region.title} intro={region.intro} image={region.image} showBreadcrumb={false} cta={QUOTE_CTA} />

    <section className="lovable-section lovable-section--soft">
      <div className="container-page detail-layout">
        <div className="detail-main">
          <div className="lovable-heading">
            <p className="lovable-kicker">Coverage</p>
            <h2>Where We Deliver</h2>
          </div>
          <div className="lovable-area-list">{region.localities.map(area => <span key={area}>{area}</span>)}</div>
          <h3>How these movements are planned</h3>
          <ul className="premium-check-list">
            {region.notes.map(note => <li key={note}><CheckCircle2 aria-hidden="true" />{note}</li>)}
          </ul>
        </div>

        <aside className="detail-aside">
          <MapPinned aria-hidden="true" />
          <h2>Check Your Route</h2>
          <p>Tell us the pickup, destination and timing and we will confirm coverage and the right vehicle for the job.</p>
          <Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote <ArrowRight size={16} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>

    <section className="lovable-section">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Interstate Linehaul</p>
          <h2>Connecting Corridors</h2>
        </div>
        <div className="lovable-feature-grid">
          {interstateRoutes.map(item =>
            <article className="lovable-feature" key={item.slug}>
              <MapPinned aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link className="fleet-card-link" to={`/service-areas/interstate/${item.slug}`}>View corridor <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>)}
        </div>
      </div>
    </section>
  </>
}
