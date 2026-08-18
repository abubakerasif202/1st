import { ArrowRight, CheckCircle2, Route, Truck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { QUOTE_CTA } from '../lib/cta'
import { ResponsiveImage } from '../components/common/ResponsiveImage'
import { SeoHead } from '../components/common/SeoHead'
import { companyProfile } from '../data/companyProfile'
import { serviceFaqs } from '../data/faqs'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'
import { FaqSchema, ServiceSchema } from '../lib/schema'

const capabilityGroups = [
  ['Freight Delivery', 'Same-day, next-day, metropolitan, regional and interstate movements assessed against the freight, route and delivery window.', Truck],
  ['Driver Support', 'Dedicated and backup driver support for regular runs, peak periods, warehouse operations and customer-facing delivery work.', UserRoundCheck],
  ['Fleet And Operations', 'Fleet supervision, route reviews, delivery-performance monitoring and operational support for ongoing requirements.', Route],
] as const

export default function ServicesPage() { return <>
  <SeoHead {...routeSeo.services}/>
  <ServiceSchema items={services}/>
  <FaqSchema items={serviceFaqs}/>
  <PageHero eyebrow="Our Services" title="Transport Built Around Your Freight" intro="From urgent local runs to high-capacity interstate movements, we match the transport plan to the freight." image="/images/replacement/delivery-fleet-sydney-branded.webp" cta={QUOTE_CTA}/>

  <section className="lovable-section"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Complete Capability</p><h2>Delivery, People And Operational Support</h2><p>1st Class Express can support the physical freight movement and the driver or fleet requirements around it, subject to assessment, agreement and availability.</p></div><div className="service-capability-grid">{capabilityGroups.map(([title,text,Icon]) => <article key={title}><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

  <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Service Capability</p><h2>Eight Ways We Move Freight</h2><p>Each service starts with the pickup, destination, timing, freight profile and any specialist handling requirements.</p></div>
    {/* Plain in-page anchors: every card already carries its service id, so this
        needs no script and works with JavaScript disabled. */}
    <ul className="service-index" aria-label="Jump to a service">{services.map(({id,title},index)=><li key={id}><a href={`#${id}`}><span>{String(index+1).padStart(2,'0')}</span>{title}</a></li>)}</ul><div className="service-detail-grid">{services.map(({id,slug,title,short,detail,image,icon:Icon},index)=><article id={id} className="service-detail-card" key={id}><div className="service-detail-card__image"><ResponsiveImage src={image} alt={`${title} transport service`} sizes="(max-width: 1024px) 100vw, 50vw"/><span>{String(index+1).padStart(2,'0')}</span></div><div><Icon aria-hidden="true"/><h3>{title}</h3><p>{short}</p><p className="detail-note"><CheckCircle2 aria-hidden="true"/>{detail}</p><div className="service-detail-card__actions"><Link to={`/services/${slug}`}>Service details <ArrowRight size={16} aria-hidden="true"/></Link><Link to="/quote">Request this service <ArrowRight size={16} aria-hidden="true"/></Link></div></div></article>)}</div></div></section>

  <section className="lovable-section lovable-section--dark"><div className="container-page premium-operations-grid"><div><p className="lovable-kicker">Professional Driver Solutions</p><h2>{companyProfile.driverSolutions.title}</h2>{companyProfile.driverSolutions.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><ul className="content-list-grid">{companyProfile.driverSolutions.standards.slice(0, 8).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul></div></section>

  <section className="lovable-section"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Common Questions</p><h2>Freight Questions, Answered</h2><p>The details customers ask about most often before booking a movement.</p></div><dl className="faq-list">{serviceFaqs.map(({question,answer})=><div className="faq-item" key={question}><dt>{question}</dt><dd>{answer}</dd></div>)}</dl></div></section>

  <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Assessment First</p><h2>Specialist Freight Is Checked Before Acceptance</h2><p>Dangerous-goods work is subject to freight classification, documentation, compliant equipment and qualified personnel.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote</Link></div></div></section>
</> }
