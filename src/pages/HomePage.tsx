import { ArrowRight, CheckCircle2, MapPinned, PackageCheck, Phone, ShieldCheck, Truck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ResponsiveImage } from '../components/common/ResponsiveImage'
import { SeoHead } from '../components/common/SeoHead'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'
import { company, phoneHref } from '../data/company'
import { companyProfile } from '../data/companyProfile'
import { interstateCoverage } from '../data/interstateRoutes'
import { serviceRegions } from '../data/serviceRegions'
import { services } from '../data/services'
import routeSeo from '../data/routeSeo.json'

const proofPoints = [
  ['Established in 2013', 'More than a decade supporting transport and logistics requirements.', ShieldCheck],
  ['Australian owned', 'A privately owned transport business focused on local and interstate freight.', UserRoundCheck],
  ['Flexible fleet', 'Vehicle options from one-tonne vans through to B-double configurations.', Truck],
  ['Australia-wide capability', 'Metropolitan, regional and planned interstate movements.', MapPinned],
] as const

const capabilityServices = services.slice(0, 4)
const secondaryServices = services.slice(4)

/**
 * Coverage cards used to repeat one sentence four times. The per-destination
 * copy already exists and is already reviewed — `interstateCoverage` for the
 * interstate destinations, the region's own intro for Sydney. Nothing here is
 * newly written, so no delivery time, distance or guarantee is implied that the
 * corridor pages do not already state.
 */
const coverageCards = company.cities.map(city => {
  const interstate = interstateCoverage.find(entry => entry.name === city)
  const region = serviceRegions.find(entry => entry.slug === city.toLowerCase())
  return { city, summary: interstate?.description ?? region?.intro ?? 'Transport capability assessed for the movement.' }
})

export default function HomePage() {
  return <>
    <SeoHead {...routeSeo.home}/>

    <section className="hybrid-hero" aria-labelledby="home-hero-title">
      <ResponsiveImage
        className="hybrid-hero__image"
        src="/images/replacement/prime-mover-network-hero.webp"
        alt="1st Class Express branded prime mover beneath a map of interstate freight routes across Australia"
        sizes="100vw"
        priority
      />
      <div className="hybrid-hero__overlay" aria-hidden="true"/>
      <div className="container-page hybrid-hero__content">
        <p className="lovable-kicker">Australian Owned Transport</p>
        <h1 id="home-hero-title">Reliable Freight.<br/><span>Professional Drivers.</span><br/>Australia-Wide.</h1>
        <p className="hybrid-hero__lead">{companyProfile.homepage.intro}</p>
        <div className="lovable-actions hybrid-hero__actions">
          <a className="lovable-btn lovable-btn--primary" href="#quick-quote">Get a Free Quote <ArrowRight size={18} aria-hidden="true"/></a>
          <Link className="lovable-btn lovable-btn--secondary" to="/fleet">Explore Our Fleet</Link>
          <a className="hybrid-hero__phone" href={phoneHref(company.phonePrimary)}><Phone size={18} aria-hidden="true"/><span><small>Speak to operations</small>{company.phonePrimary}</span></a>
        </div>
        <p className="hybrid-hero__supporting"><CheckCircle2 aria-hidden="true"/> {companyProfile.homepage.supportingLine}</p>
      </div>
      <div className="hybrid-hero__rail" aria-label="Verified company strengths">
        <div className="container-page hybrid-hero__rail-grid">
          {proofPoints.map(([title, text, Icon]) => <article key={title}><Icon aria-hidden="true"/><div><strong>{title}</strong><span>{text}</span></div></article>)}
        </div>
      </div>
    </section>

    <section className="hybrid-section hybrid-capability" aria-labelledby="capability-title">
      <div className="container-page">
        <div className="hybrid-section-heading">
          <div><p className="lovable-kicker">Decision 01 · Freight fit</p><h2 id="capability-title">Can We Move Your Freight?</h2></div>
          <div><p>Every enquiry begins with the freight, timing, access and route. Start with the capability closest to the job, then view the full documented service list.</p><Link to="/services">View all services <ArrowRight size={16} aria-hidden="true"/></Link></div>
        </div>
        <div className="hybrid-capability-grid">
          <div className="hybrid-capability-list" role="list" aria-label="Core service capabilities">
            {capabilityServices.map(({ id, title, short, icon: Icon }, index) => <Link className="hybrid-capability-item" key={id} to={`/services/${id}`} role="listitem"><span className="hybrid-capability-item__index">0{index + 1}</span><Icon aria-hidden="true"/><span><h3>{title}</h3><small>{short}</small></span><ArrowRight aria-hidden="true"/></Link>)}
          </div>
          <div className="hybrid-capability-panel">
            <p className="lovable-kicker">Built around the movement</p>
            <h3>Right vehicle. Right route. One coordinated plan.</h3>
            <p>From urgent metropolitan deliveries to higher-volume interstate movements, vehicle selection is matched to freight dimensions, weight, access and route.</p>
            <ul><li><CheckCircle2 aria-hidden="true"/>Experienced transport and logistics professionals</li><li><CheckCircle2 aria-hidden="true"/>Flexible short-term and long-term solutions</li><li><CheckCircle2 aria-hidden="true"/>Dangerous goods assessed before confirmation</li></ul>
          </div>
        </div>
        <p className="lovable-kicker hybrid-capability-more__label">Also available</p>
        <div className="hybrid-capability-more" aria-label="Additional documented services">
          {secondaryServices.map(({ id, title, short, icon: Icon }) => <Link key={id} to={`/services/${id}`}><Icon aria-hidden="true"/><span><h3>{title}</h3><small>{short}</small></span><ArrowRight aria-hidden="true"/></Link>)}
        </div>
      </div>
    </section>

    <section className="hybrid-section hybrid-coverage" aria-labelledby="coverage-title">
      <div className="container-page">
        <div className="hybrid-section-heading">
          <div><p className="lovable-kicker">Decision 02 · Route coverage</p><h2 id="coverage-title">Do We Cover Your Route?</h2></div>
          <div><p>Service areas include Sydney metropolitan and regional movements, Canberra and planned interstate routes assessed for each movement.</p><Link to="/service-areas">Explore service areas <ArrowRight size={16} aria-hidden="true"/></Link></div>
        </div>
        <div className="hybrid-coverage-grid">{coverageCards.map(({ city, summary }) => <div key={city}><strong>{city}</strong><span>{summary}</span></div>)}</div>
      </div>
    </section>

    <section className="hybrid-section hybrid-operations" aria-labelledby="operations-title">
      <div className="container-page hybrid-operations-grid">
        <div className="hybrid-operations-media"><ResponsiveImage src="/images/replacement/fleet-lineup-depot-branded.webp" alt="1st Class Express branded fleet lined up at the depot" sizes="(max-width: 900px) 100vw, 52vw"/><div><strong>One-tonne vans to B-doubles</strong><span>Configuration and availability confirmed for each booking.</span></div></div>
        <div><p className="lovable-kicker">Operational proof</p><h2 id="operations-title">Planned around your business.</h2><p>{companyProfile.about.paragraphs[4]}</p><ul className="hybrid-check-list">{companyProfile.operations.slice(1, 5).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul><Link className="lovable-btn lovable-btn--secondary" to="/about">How We Work <ArrowRight size={17} aria-hidden="true"/></Link></div>
      </div>
    </section>

    <section id="quick-quote" className="hybrid-section hybrid-quote" aria-labelledby="quote-title">
      <div className="container-page hybrid-quote-grid">
        <div><p className="lovable-kicker">Decision 03 · Start the conversation</p><h2 id="quote-title">Tell Us What Needs Moving.</h2><p>{companyProfile.homepage.detail}</p><div className="hybrid-quote-assurance"><PackageCheck aria-hidden="true"/><span>Useful details get a useful response. Include freight type, pickup, destination, timing and anything unusual about access or handling.</span></div><a className="hybrid-quote-phone" href={phoneHref(company.phonePrimary)}><Phone aria-hidden="true"/><span><small>Prefer to speak?</small>{company.phonePrimary}</span></a></div>
        <QuickQuoteForm/>
      </div>
    </section>
  </>
}
