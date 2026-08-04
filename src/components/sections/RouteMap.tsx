import { company } from '../../data/company'

export function RouteMap() {
  return <div className="route-map"><div className="route-photo">
    <img src="/images/generated/route-network.jpg" loading="lazy" width="1920" height="1080" alt="Australian logistics depot beside an interstate highway at blue hour" />
    <div className="route-photo-shade" />
    <div className="route-photo-copy"><p className="eyebrow">Interstate capability</p><h3>Connected across the country</h3><p>Freight support linking major capitals with metropolitan and regional delivery networks.</p></div>
    <div className="interstate-cities" aria-label="Interstate service locations">{company.interstate.map(place => <span key={place}>{place}</span>)}</div>
  </div><div className="area-list"><p className="eyebrow">Regional network</p><h3>From metro deliveries to key regional centres</h3><div>{company.serviceAreas.map(place => <span key={place}>{place}</span>)}</div></div></div>
}
