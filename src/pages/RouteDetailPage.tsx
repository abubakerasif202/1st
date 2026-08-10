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
              <Link to="/quote" className="lovable-btn lovable-btn--primary inline-flex items-center">
                Get a Route Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
