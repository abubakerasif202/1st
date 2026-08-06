import { ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const routeCities = [
  { name: 'Sydney', type: 'Local & interstate hub', desc: 'Home base for metropolitan deliveries and the starting point for every interstate linehaul movement we run.' },
  { name: 'Melbourne', type: 'Interstate linehaul', desc: 'Planned linehaul freight between Sydney and Melbourne, servicing metropolitan and regional Victoria.' },
  { name: 'Adelaide', type: 'Interstate linehaul', desc: 'Interstate freight movements connecting Sydney with Adelaide and surrounding South Australian regions.' },
  { name: 'Brisbane', type: 'Interstate linehaul', desc: 'Regular linehaul capability between Sydney and Brisbane, extending to South-East Queensland.' },
  { name: 'Canberra', type: 'Regional', desc: 'Canberra and the ACT are serviced as part of our regional New South Wales coverage.' },
  { name: 'Darwin', type: 'Interstate linehaul', desc: 'Long-distance linehaul freight to Darwin and the Northern Territory, assessed for route, timing and vehicle configuration.' },
  { name: 'Perth', type: 'Interstate — by assessment', desc: 'Perth and Western Australian freight is assessed on a per-job basis, subject to route and timing review.' },
  { name: 'Hobart', type: 'Interstate — by assessment', desc: 'Tasmanian freight is assessed on a per-job basis, subject to route, timing and transport-link availability.' },
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
