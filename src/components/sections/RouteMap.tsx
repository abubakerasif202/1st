import { company } from '../../data/company'

export function RouteMap() {
  return <div className="route-map"><div className="route-visual" aria-label="Interstate service routes between Sydney, Brisbane, Melbourne, Adelaide and Perth">
    <span className="route route-a"/><span className="route route-b"/><span className="route route-c"/>
    {company.interstate.map((place, i) => <span key={place} className={`map-point point-${i}`}><i/>{place}</span>)}
  </div><div className="area-list"><p className="eyebrow">Regional network</p><h3>From metro deliveries to key regional centres</h3><div>{company.serviceAreas.map(place => <span key={place}>{place}</span>)}</div></div></div>
}
