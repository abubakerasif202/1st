import { ButtonLink } from '../components/common/ButtonLink'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { companyProfile } from '../data/companyProfile'
import { fleet } from '../data/fleet'

export default function FleetPage() {
  return <>
    <SeoHead {...routeSeo.fleet}/>
    <PageHero eyebrow="Our Fleet" title="Vehicle and fleet options built around your operation" intro="From vans and light trucks to rigid, curtain-side and interstate linehaul vehicles, fleet support is assessed against the freight, route and required service."/>
    <section className="fleet-stage"><div className="container-page"><div className="fleet-image-wrap premium-fleet-image">
      <img src="/images/generated/mercedes-actros-linehaul.jpg" alt="Mercedes-Benz Actros prime mover towing a refrigerated semi-trailer on an Australian interstate highway" width="1920" height="1080" loading="eager" decoding="async"/>
      <span>Featured fleet</span><div className="fleet-image-caption"><small>Mercedes-Benz Actros</small><strong>Premium linehaul presence</strong></div>
    </div></div></section>
    <section className="fleet-journeys"><div className="container-page fleet-journey-grid">
      <figure><img src="/images/generated/kenworth-k220-linehaul.jpg" loading="lazy" decoding="async" width="1920" height="1080" alt="Kenworth K220 cab-over prime mover towing a B-double on an Australian highway"/><figcaption><span>Kenworth K220</span><strong>Cab-over B-double capability</strong></figcaption></figure>
      <article className="fleet-model-copy"><p className="eyebrow">Linehaul options</p><h2>Recognisable trucks. Matched to the movement.</h2><p>Mercedes-Benz Actros and Kenworth K220 prime movers support assessed interstate linehaul requirements. Vehicle availability and configuration are confirmed for each booking.</p><dl><div><dt>Mercedes-Benz Actros</dt><dd>Late-model prime-mover support for planned interstate work.</dd></div><div><dt>Kenworth K220</dt><dd>Cab-over linehaul support for assessed B-double freight movements.</dd></div></dl><p className="fleet-availability">Short-term fleet support, long-term fleet solutions and ongoing managed fleet services can be structured around your operation.</p><ButtonLink to="/book-now" variant="secondary">Discuss your fleet requirements</ButtonLink></article>
    </div></section>
    <section className="section"><div className="container-page"><SectionHeading eyebrow="Vehicle categories" title="From metropolitan agility to linehaul capability" intro="Vehicle selection is confirmed against the freight and route. Capacities and specialist requirements are assessed for each request."/><div className="fleet-card-grid">{fleet.map(({title,use,icon:Icon},i)=><article key={title}><span>0{i+1}</span><Icon aria-hidden="true"/><h3>{title}</h3><p>{use}</p><ButtonLink to="/book-now" variant="secondary" ariaLabel={`Ask about ${title}`}>Ask about this vehicle</ButtonLink></article>)}</div></div></section>
    <section className="section people-section"><div className="container-page"><SectionHeading eyebrow="Managed fleet support" title="Short-term coverage through to ongoing fleet management" intro="Fleet and driver support can be structured around regular runs, seasonal demand, business growth and continuity planning."/><ul className="content-list-grid content-list-grid--light">{companyProfile.benefits.filter(item=>/fleet|driver|backup|rotation|weekend|day and night/i.test(item)).map(item=><li key={item}>{item}</li>)}</ul></div></section>
    <CallToAction title="Not sure which vehicle you need?" text="Send the freight details and we’ll help assess the right fleet category and support model."/>
  </>
}
