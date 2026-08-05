import { ArrowRight, MapPinned, Phone, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { company, phoneHref } from '../data/company'

const groups = [
  ['Sydney & Metropolitan', ['Sydney Metropolitan Area','Sydney CBD','Parramatta','Western Sydney','Northern Sydney','South Sydney']],
  ['Greater New South Wales', ['Wollongong','Wagga Wagga','Narrandera','Griffith','Albury','Blue Mountains','Lithgow','Bathurst','Orange','Mudgee','Dubbo','Parkes']],
  ['Central Coast & Hunter', ['Central Coast','Newcastle','Muswellbrook','Tamworth']],
  ['ACT & Interstate', ['Canberra','Sydney–Melbourne corridors','Sydney–Brisbane corridors','Other major destinations subject to route review']],
] as const

export default function ServiceAreasPage(){
  return <>
    <SeoHead title="Freight Service Areas | 1st Class Express" description="Freight transport across Sydney, regional NSW, Canberra and interstate routes between major Australian destinations." path="/service-areas"/>
    <section className="lovable-page-hero"><div className="container-page"><p className="lovable-kicker">Service Areas</p><h1>Where We Deliver</h1><p>Sydney and metropolitan NSW, regional New South Wales, the ACT and interstate routes between major Australian destinations.</p></div></section>
    <section className="lovable-section lovable-section--soft"><div className="container-page">
      <div className="lovable-heading"><p className="lovable-kicker">Route Coverage</p><h2>Local Knowledge. Interstate Reach.</h2><p>Route availability is confirmed after reviewing freight type, access, timing and vehicle requirements.</p></div>
      <div className="lovable-route-grid">{groups.map(([title,items])=><article className="lovable-route-card" key={title}><MapPinned color="#d92f43"/><h3>{title}</h3><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
    </div></section>
    <section className="lovable-section lovable-section--dark"><div className="container-page lovable-split"><div><p className="lovable-kicker">Check Your Route</p><h2>Tell Us The Pickup And Destination</h2><p>Send through the route, freight details and preferred timing. Our team will confirm availability and the most suitable transport configuration.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/book-now">Request a Route Quote <ArrowRight size={18}/></Link><a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18}/>Call {company.phonePrimary}</a></div></div><div className="lovable-feature"><Route size={40}/><h3>Availability is confirmed per job</h3><p>Interstate services are subject to route, freight, timing, access and compliance requirements.</p></div></div></section>
  </>
}
