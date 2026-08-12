import { ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { interstateCoverage } from '../../data/interstateRoutes'

const routeCities = [
  { name: 'Sydney', type: 'Local and interstate hub', desc: 'Home base for metropolitan deliveries and the starting point for the interstate movements we plan.' },
  ...interstateCoverage.map(({ name, type, description }) => ({ name, type, desc: description })),
] as const

export function RouteExplorer() {
  const [active, setActive] = useState<(typeof routeCities)[number]>(routeCities[0])
  return <div className="route-explorer">
    <div className="route-explorer__cities" role="group" aria-label="Select a city to view coverage">
      {routeCities.map(city => <button key={city.name} type="button" className={`route-explorer__city ${active.name === city.name ? 'is-active' : ''}`} aria-pressed={active.name === city.name} onClick={() => setActive(city)}><MapPin size={14} aria-hidden="true" />{city.name}</button>)}
    </div>
    <div className="route-explorer__panel">
      <span className="route-explorer__badge">{active.type}</span>
      <h3>{active.name}</h3>
      <p>{active.desc}</p>
      <Link to="/quote" className="lovable-btn lovable-btn--primary">Request a Quote for This Route <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  </div>
}
