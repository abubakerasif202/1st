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
      <img src="/images/generated/fleet-lineup.jpg" alt="Delivery van, rigid truck, prime mover and semi-trailer representing the 1st Class Express vehicle range" width="1920" height="1080"/>
      <span>Fleet range</span><div className="fleet-image-caption"><small>From final mile to linehaul</small><strong>Built to scale with the freight</strong></div>
    </div></div></section>
    <section className="fleet-journeys"><div className="container-page fleet-journey-grid">
      <figure><img src="/images/generated/hero-interstate-truck.jpg" loading="lazy" width="1920" height="1080" alt="Unbranded B-double travelling on an Australian interstate highway at sunrise"/><figcaption><span>Linehaul</span><strong>Interstate capability</strong></figcaption></figure>
      <figure><img src="/images/generated/route-network.jpg" loading="lazy" width="1920" height="1080" alt="Australian freight depot connected to an interstate highway at blue hour"/><figcaption><span>Network</span><strong>Metro to regional routes</strong></figcaption></figure>
    </div></section>
    <section className="section"><div className="container-page"><SectionHeading eyebrow="Vehicle categories" title="From metropolitan agility to linehaul capability" intro="Vehicle selection is confirmed against the freight and route. Capacities and specialist requirements are assessed for each request."/><div className="fleet-card-grid">{fleet.map(({title,use,icon:Icon},i)=><article key={title}><span>0{i+1}</span><Icon/><h2>{title}</h2><p>{use}</p><ButtonLink to="/book-now" variant="secondary">Ask about this vehicle</ButtonLink></article>)}</div></div></section>
    <CallToAction title="Not sure which vehicle you need?" text="Send the freight details and we’ll help assess the right fleet category."/>
  </>
}
