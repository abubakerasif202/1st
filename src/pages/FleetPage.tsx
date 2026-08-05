import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { fleet } from '../data/fleet'
import routeSeo from '../data/routeSeo.json'

export default function FleetPage() { return <>
  <SeoHead {...routeSeo.fleet}/>
  <PageHero eyebrow="Our Fleet" title="The Right Vehicle For The Freight" intro="From one-tonne vans to B-double configurations, final vehicle selection is matched to the load, access, timing and route." image="/images/lovable/depot-fleet.jpg"/>
  <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Vehicle Options</p><h2>Fleet Capability</h2><p>Availability and configuration are confirmed for each booking.</p></div><div className="fleet-detail-grid lovable-fleet-details">{fleet.map(({title,use,bestFor,serviceType,availability,image,icon:Icon})=><article className="fleet-detail-card" key={title}><div className="fleet-detail-card__image"><img src={image} alt={`${title} transport option`} loading="lazy"/></div><div className="fleet-detail-card__body"><div className="fleet-detail-card__heading"><Icon/><h3>{title}</h3></div><p>{use}</p><dl><div><dt>Best suited for</dt><dd>{bestFor}</dd></div><div><dt>Service type</dt><dd>{serviceType}</dd></div><div><dt>Availability</dt><dd>{availability}</dd></div></dl><Link className="fleet-card-link" to="/quote">Ask about this vehicle <ArrowRight size={16}/></Link></div></article>)}</div></div></section>
  <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Fleet Gallery</p><h2>On The Road And In The Yard</h2></div><div className="fleet-gallery"><img src="/images/lovable/fleet-lineup.jpg" alt="Fleet lineup at sunset"/><img src="/images/lovable/silver-prime-mover.webp" alt="Prime mover and semi-trailer on the highway"/><img src="/images/lovable/warehouse-forklift.jpg" alt="Forklift handling freight in a warehouse"/><img src="/images/lovable/semi-dusk.jpg" alt="Semi-trailer at dusk"/></div><p className="qualification-note"><CheckCircle2/>Vehicle type, configuration and capacity are confirmed after the freight details are assessed.</p></div></section>
  <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Match The Vehicle</p><h2>Tell Us What You Need To Move</h2><p>We will review the freight and confirm the most suitable available transport configuration.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Get a Fleet Quote</Link></div></div></section>
</> }
