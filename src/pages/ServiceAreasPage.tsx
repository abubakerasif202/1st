import { ArrowRight, MapPinned, Phone, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { RouteExplorer } from '../components/sections/RouteExplorer'
import { SeoHead } from '../components/common/SeoHead'
import { company, phoneHref } from '../data/company'
import routeSeo from '../data/routeSeo.json'

const groups = [
  ['Sydney & Metropolitan', ['Sydney Metropolitan Area','Sydney CBD','Parramatta','Western Sydney','Northern Sydney','South Sydney']],
  ['Greater New South Wales', ['Wollongong','Wagga Wagga','Narrandera','Griffith','Albury','Blue Mountains','Lithgow','Bathurst','Orange','Mudgee','Dubbo','Parkes']],
  ['Central Coast & Hunter', ['Central Coast','Newcastle','Muswellbrook','Tamworth']],
  ['Interstate Linehaul', ['Canberra, ACT','Melbourne, VIC','Adelaide, SA','Brisbane, QLD','Darwin, NT','Perth, WA — subject to route review']],
] as const

export default function ServiceAreasPage(){ return <>
  <SeoHead {...routeSeo.serviceAreas}/>
  <PageHero eyebrow="Service Areas" title="Metropolitan, Regional And Interstate" intro="Local knowledge across Sydney and New South Wales, backed by planned linehaul services connecting every Australian mainland capital." image="/images/replacement/prime-mover-hero-branded.png"/>
  <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Coverage</p><h2>Routes We Run</h2><p>Availability is confirmed after reviewing freight type, access, timing and vehicle requirements.</p></div><div className="lovable-route-grid">{groups.map(([title,items])=><article className="lovable-route-card" key={title}><MapPinned/><h3>{title}</h3><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div></div></section>
  <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Our Network</p><h2>Australia-Wide Interstate Transport</h2><p>1st Class Express is not a Sydney-only operator — we plan and run linehaul freight between every mainland capital, from Darwin in the north to Adelaide and Melbourne in the south.</p></div><div className="route-map-visual"><img src="/images/replacement/australia-network-map.png" alt="Map of Australia showing 1st Class Express interstate freight routes connecting Sydney, Melbourne, Adelaide, Darwin, Brisbane, Canberra, Perth and Hobart" loading="lazy" width="1672" height="941"/></div></div></section>
  <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Route Explorer</p><h2>Select A City For Coverage Details</h2><p>Choose a capital city to see how we service that route. Servicing major freight routes across the network below.</p></div><RouteExplorer/></div></section>
  <section className="lovable-section lovable-section--soft"><div className="container-page lovable-split"><div><div className="lovable-heading"><p className="lovable-kicker">Interstate Linehaul</p><h2>Longer Runs, Planned Properly</h2><p>Tell us the pickup, destination, freight profile and preferred timing. We will confirm the route and most suitable transport configuration.</p></div><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Route Quote <ArrowRight size={18}/></Link><a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18}/>{company.phonePrimary}</a></div></div><div className="route-assurance"><Route/><h3>Availability confirmed per job</h3><p>Interstate services are subject to route, freight, timing, access and compliance requirements.</p></div></div></section>
</> }
