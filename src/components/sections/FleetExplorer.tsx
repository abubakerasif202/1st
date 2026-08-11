import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fleet } from '../../data/fleet'

export function FleetExplorer() {
  const categories = useMemo(() => Array.from(new Set(fleet.map(vehicle => vehicle.category))), [])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const visibleFleet = activeCategory ? fleet.filter(vehicle => vehicle.category === activeCategory) : fleet

  return <div className="fleet-explorer">
    <div className="fleet-explorer__filters route-explorer__cities" role="group" aria-label="Filter fleet by category">
      <button type="button" className={`route-explorer__city${activeCategory === null ? ' is-active' : ''}`} aria-pressed={activeCategory === null} onClick={() => setActiveCategory(null)}>All</button>
      {categories.map(category => <button type="button" key={category} className={`route-explorer__city${activeCategory === category ? ' is-active' : ''}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
    </div>
    <div className="fleet-explorer__list">
      {visibleFleet.map(({ slug, title, use, bestFor, serviceType, availability, image, icon: Icon, capability }, index) => (
        <article className={`fleet-explorer__row lovable-split${index % 2 === 1 ? ' fleet-explorer__row--reverse' : ''}`} key={title}>
          <div className="lovable-split__image fleet-explorer__image"><img src={image} alt={`${title} transport option`} loading="lazy"/></div>
          <div className="fleet-explorer__body">
            <div className="fleet-detail-card__heading"><Icon aria-hidden="true"/><h3>{title}</h3></div>
            <span className="route-explorer__badge">{capability}</span>
            <p>{use}</p>
            <dl>
              <div><dt>Best suited for</dt><dd>{bestFor}</dd></div>
              <div><dt>Service type</dt><dd>{serviceType}</dd></div>
              <div><dt>Availability</dt><dd>{availability}</dd></div>
            </dl>
            <div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote <ArrowRight size={16} aria-hidden="true"/></Link><Link className="lovable-btn lovable-btn--ink" to={`/fleet/${slug}`}>View {title} details</Link></div>
          </div>
        </article>
      ))}
    </div>
  </div>
}
