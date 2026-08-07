import { company } from '../../data/company'

export function RouteMap() {
  return <div className="route-map"><div className="route-photo">
    <img src="/images/replacement/complete-fleet-lineup-branded.webp" loading="lazy" width="1672" height="941" alt="1st Class Express branded fleet lineup" />
    <img className="vehicle-brand-mark" src="/brand/first-class-express-logo.webp" loading="lazy" alt="" width="90" height="98" />
    <div className="route-photo-shade" />
    <div className="route-photo-copy"><p className="eyebrow">Interstate capability</p><h3>Connected across the country</h3><p>Freight support linking major capitals with metropolitan and regional delivery networks.</p></div>
    <div className="interstate-cities" aria-label="Interstate service locations">{company.interstate.map(place => <span key={place}>{place}</span>)}</div>
  </div><div className="area-list"><p className="eyebrow">Regional network</p><h3>From metro deliveries to key regional centres</h3><div>{company.serviceAreas.map(place => <span key={place}>{place}</span>)}</div></div></div>
}
