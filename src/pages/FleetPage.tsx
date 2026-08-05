import { ButtonLink } from '../components/common/ButtonLink'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import { fleet } from '../data/fleet'

export default function FleetPage() {
  return <>
    <SeoHead path="/our-fleet" title="Our Fleet | Vans, Trucks & Interstate Freight" description="Explore the 1st Class Express fleet, from 1-tonne vans and pallet trucks to rigid trucks, prime movers and semi-trailers."/>
    <PageHero eyebrow="Our Fleet" title="The right scale for every movement" intro="Our vehicles range from 1 tonne vans to pallet trucks, sizing up to semi-trailers."/>
    <section className="fleet-stage"><div className="container-page"><div className="fleet-image-wrap premium-fleet-image">
      <img src="/images/generated/mercedes-actros-linehaul.jpg" alt="Mercedes-Benz Actros prime mover towing a refrigerated semi-trailer on an Australian interstate highway" width="1920" height="1080" fetchPriority="high" decoding="async"/>
      <span>Featured fleet</span><div className="fleet-image-caption"><small>Mercedes-Benz Actros</small><strong>Premium linehaul presence</strong></div>
    </div></div></section>
    <section className="fleet-journeys"><div className="container-page fleet-journey-grid">
      <figure><img src="/images/generated/kenworth-k220-linehaul.jpg" loading="lazy" decoding="async" width="1920" height="1080" alt="Kenworth K220 cab-over prime mover towing a B-double on an Australian highway"/><figcaption><span>Kenworth K220</span><strong>Cab-over B-double capability</strong></figcaption></figure>
      <article className="fleet-model-copy"><p className="eyebrow">Linehaul options</p><h2>Recognisable trucks. Matched to the movement.</h2><p>Mercedes-Benz Actros and Kenworth K220 prime movers give the fleet page a clearer view of the equipment used for assessed linehaul requirements.</p><dl><div><dt>Mercedes-Benz Actros</dt><dd>Efficient, modern prime-mover presentation for interstate work.</dd></div><div><dt>Kenworth K220</dt><dd>Australian cab-over presence for B-double freight movements.</dd></div></dl><p className="fleet-availability">Vehicle availability and final configuration are confirmed for each booking.</p><ButtonLink to="/book-now" variant="secondary">Discuss your freight</ButtonLink></article>
    </div></section>
    <section className="section"><div className="container-page"><SectionHeading eyebrow="Vehicle categories" title="From metropolitan agility to linehaul capability" intro="Vehicle selection is confirmed against the freight and route. Capacities and specialist requirements are assessed for each request."/><div className="fleet-card-grid">{fleet.map(({title,use,icon:Icon},i)=><article key={title}><span>0{i+1}</span><Icon/><h2>{title}</h2><p>{use}</p><ButtonLink to="/book-now" variant="secondary">Ask about this vehicle</ButtonLink></article>)}</div></div></section>
    <CallToAction title="Not sure which vehicle you need?" text="Send the freight details and we’ll help assess the right fleet category."/>
  </>
}
