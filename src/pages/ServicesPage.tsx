import { ButtonLink } from '../components/common/ButtonLink'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

export default function ServicesPage() { return <><SeoHead {...routeSeo.services}/><PageHero eyebrow="Our Services" title="Freight services shaped around the job" intro="Flexible transport support for urgent deliveries, regular freight and the moments when your operation needs an experienced extra hand."/><section className="section"><div className="container-page detailed-services">{services.map(({title,detail,short,icon:Icon},i)=><article key={title}><div className="service-number">0{i+1}</div><div className="service-symbol"><Icon aria-hidden="true"/></div><div><h2>{title}</h2><p>{short}</p><p className="operational-note"><strong>How it works:</strong> {detail} Share the freight details, pickup, destination and preferred timing so the request can be assessed.</p></div><ButtonLink to="/book-now" variant="secondary" ariaLabel={`Book ${title}`}>Book Now</ButtonLink></article>)}</div></section><CallToAction/></> }
