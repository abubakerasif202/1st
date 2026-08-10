import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { fleet } from '../data/fleet'
import NotFoundPage from './NotFoundPage'

export default function FleetDetailPage() {
  const { fleetId } = useParams<{ fleetId: string }>()
  const item = fleet.find(
    (f) => f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === fleetId
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
              <p><strong className="text-amber-400">Freight Capability:</strong> {item.capability}</p>
            </div>
            <div className="mt-8">
              <Link to="/quote" className="lovable-btn lovable-btn--primary inline-flex items-center">
                Book This Vehicle <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
