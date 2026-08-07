import { ArrowRight, CheckCircle2, Route, Truck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { companyProfile } from '../data/companyProfile'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

const capabilityGroups = [
  ['Freight Delivery', 'Same-day, next-day, metropolitan, regional and interstate movements assessed against the freight, route and delivery window.', Truck],
  ['Driver Support', 'Dedicated and backup driver support for regular runs, peak periods, warehouse operations and customer-facing delivery work.', UserRoundCheck],
  ['Fleet And Operations', 'Fleet supervision, route reviews, delivery-performance monitoring and operational support for ongoing requirements.', Route],
] as const

export default function ServicesPage() { return <>
  <SeoHead {...routeSeo.services}/>
  <PageHero eyebrow="Our Services" title="Transport Built Around Your Freight" intro="From urgent local runs to high-capacity interstate movements, we match the transport plan to the freight." image="/images/replacement/delivery-fleet-sydney-branded.webp"/>

  <section className="lovable-section"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Complete Capability</p><h2>Delivery, People And Operational Support</h2><p>1st Class Express can support the physical freight movement and the driver or fleet requirements around it, subject to assessment, agreement and availability.</p></div><div className="service-capability-grid">{capabilityGroups.map(([title,text,Icon]) => <article key={title}><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

  <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Service Capability</p><h2>Eight Ways We Move Freight</h2><p>Each service starts with the pickup, destination, timing, freight profile and any specialist handling requirements.</p></div><div className="service-detail-grid">{services.map(({id,title,short,detail,image,icon:Icon},index)=><article id={id} className="service-detail-card" key={id}><div className="service-detail-card__image"><img src={image} alt={`${title} transport service`} width="1672" height="941" loading="lazy" decoding="async"/><span>{String(index+1).padStart(2,'0')}</span></div><div><Icon aria-hidden="true"/><h3>{title}</h3><p>{short}</p><p className="detail-note"><CheckCircle2 aria-hidden="true"/>{detail}</p><Link to="/quote">Request this service <ArrowRight size={16}/></Link></div></article>)}</div></div></section>

  <section className="lovable-section lovable-section--dark"><div className="container-page premium-operations-grid"><div><p className="lovable-kicker">Professional Driver Solutions</p><h2>{companyProfile.driverSolutions.title}</h2>{companyProfile.driverSolutions.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><ul className="content-list-grid">{companyProfile.driverSolutions.standards.slice(0, 8).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul></div></section>

  <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Assessment First</p><h2>Specialist Freight Is Checked Before Acceptance</h2><p>Dangerous-goods work is subject to freight classification, documentation, compliant equipment and qualified personnel.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote</Link></div></div></section>
</> }
