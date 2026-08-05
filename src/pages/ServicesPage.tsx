import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

export default function ServicesPage() { return <>
  <SeoHead {...routeSeo.services}/>
  <PageHero eyebrow="Our Services" title="Transport Built Around Your Freight" intro="From urgent local runs to high-capacity interstate movements, we match the transport plan to the freight." image="/images/lovable/forklift-trailer.jpg"/>
  <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Service Capability</p><h2>Eight Ways We Move Freight</h2><p>Each service starts with the pickup, destination, timing, freight profile and any specialist handling requirements.</p></div><div className="service-detail-grid">{services.map(({id,title,short,detail,image,icon:Icon},index)=><article id={id} className="service-detail-card" key={id}><div className="service-detail-card__image"><img src={image} alt={`${title} transport service`} loading="lazy"/><span>{String(index+1).padStart(2,'0')}</span></div><div><Icon/><h2>{title}</h2><p>{short}</p><p className="detail-note"><CheckCircle2/>{detail}</p><Link to="/quote">Request this service <ArrowRight size={16}/></Link></div></article>)}</div></div></section>
  <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Assessment First</p><h2>Specialist Freight Is Checked Before Acceptance</h2><p>Dangerous-goods work is subject to freight classification, documentation, compliant equipment and qualified personnel.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote</Link></div></div></section>
</> }
