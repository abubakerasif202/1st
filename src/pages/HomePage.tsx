import { ArrowRight, CheckCircle2, ClipboardCheck, MapPinned, PackageCheck, Phone, Route, ShieldCheck, Truck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'
import { company, phoneHref } from '../data/company'
import { companyProfile } from '../data/companyProfile'
import { services } from '../data/services'
import routeSeo from '../data/routeSeo.json'

const verifiedStrengths = [
  ['Established in 2013', 'More than a decade supporting transport and logistics requirements.', ShieldCheck],
  ['Australian owned', 'A privately owned transport business focused on local and interstate freight.', UserRoundCheck],
  ['Flexible fleet', 'Vehicle options from one-tonne vans through to B-double configurations.', Truck],
  ['Australia-wide capability', 'Metropolitan, regional and planned interstate movements.', MapPinned],
] as const

const process = [
  ['01', 'Tell us what is moving', 'Share the collection, destination, freight profile, timing and access details.'],
  ['02', 'We assess the movement', 'The team reviews the route, vehicle, handling and scheduling requirements.'],
  ['03', 'Confirm and coordinate', 'Once agreed, the movement is scheduled and managed through to delivery.'],
] as const

export default function HomePage() {
  return <>
    <SeoHead {...routeSeo.home}/>

    <section className="lovable-hero premium-hero" aria-labelledby="home-hero-title">
      <img
        className="lovable-hero__image"
        src="/images/replacement/prime-mover-network-hero.webp"
        alt="1st Class Express branded prime mover beneath a map of interstate freight routes across Australia"
        width="1672"
        height="941"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="lovable-hero__overlay" aria-hidden="true"/>
      <div className="container-page premium-hero__content">
        <p className="lovable-kicker">Australian Owned Transport</p>
        <h1 id="home-hero-title" tabIndex={-1}>{companyProfile.homepage.title}</h1>
        <p className="lovable-hero__lead">{companyProfile.homepage.intro}</p>
        <div className="lovable-actions premium-hero__actions">
          <a className="lovable-btn lovable-btn--primary" href="#quick-quote">Get a Free Quote <ArrowRight size={18} aria-hidden="true"/></a>
          <Link className="lovable-btn lovable-btn--secondary" to="/fleet">Explore Our Fleet</Link>
          <a className="premium-hero__phone" href={phoneHref(company.phonePrimary)}><Phone size={18} aria-hidden="true"/> {company.phonePrimary}</a>
        </div>
        <p className="premium-hero__supporting"><CheckCircle2 aria-hidden="true"/> {companyProfile.homepage.supportingLine}</p>
      </div>
    </section>

    <section className="premium-proof-rail" aria-label="Verified company strengths">
      <div className="container-page premium-proof-rail__grid">
        {verifiedStrengths.map(([title, text, Icon]) => <article key={title}><Icon aria-hidden="true"/><div><h2>{title}</h2><p>{text}</p></div></article>)}
      </div>
    </section>

    <section className="lovable-section lovable-section--dark premium-fleet-showcase">
      <div className="container-page">
        <div className="premium-section-heading">
          <div><p className="lovable-kicker">Fleet Capability</p><h2>The Right Vehicle. The Right Route. One Coordinated Plan.</h2></div>
          <div><p>From urgent metropolitan deliveries to high-capacity interstate movements, vehicle selection is matched to the freight rather than forced into a fixed template.</p><Link to="/fleet">Explore every vehicle type <ArrowRight size={16} aria-hidden="true"/></Link></div>
        </div>
        <div className="premium-fleet-grid">
          <figure className="premium-fleet-grid__main">
            <img src="/images/replacement/fleet-lineup-depot-branded.webp" alt="1st Class Express branded fleet lined up at the depot" width="1672" height="941" loading="lazy" decoding="async"/>
            <figcaption><strong>One-tonne vans to B-doubles</strong><span>Configuration and availability confirmed for each booking.</span></figcaption>
          </figure>
          <figure>
            <img src="/images/replacement/prime-mover-sunset-branded.webp" alt="1st Class Express branded prime mover at sunset" width="1672" height="941" loading="lazy" decoding="async"/>
            <figcaption><strong>Interstate linehaul</strong><span>Route and load requirements reviewed before confirmation.</span></figcaption>
          </figure>
          <figure>
            <img src="/images/replacement/warehouse-dock-branded.webp" alt="1st Class Express branded freight operation at a loading dock" width="1672" height="941" loading="lazy" decoding="async"/>
            <figcaption><strong>Freight coordination</strong><span>Vehicle, driver, timing and handling planned together.</span></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="lovable-section premium-services-section">
      <div className="container-page">
        <div className="premium-section-heading premium-section-heading--ink">
          <div><p className="lovable-kicker">Eight Documented Services</p><h2>Transport Support Built Around The Job</h2></div>
          <div><p>Every enquiry begins with the freight, timing, access and route. Specialist or availability-dependent work is confirmed after assessment.</p><Link to="/services">View full service details <ArrowRight size={16} aria-hidden="true"/></Link></div>
        </div>
        <div className="lovable-service-grid premium-service-grid">
          {services.map(({ id, title, short, icon: Icon }, index) => <article className="lovable-service-card" key={id}>
            <span className="premium-card-index">{String(index + 1).padStart(2, '0')}</span>
            <Icon aria-hidden="true"/>
            <h3>{title}</h3>
            <p>{short}</p>
            <Link to={`/services#${id}`}>Service details <ArrowRight size={15} aria-hidden="true"/></Link>
          </article>)}
        </div>
      </div>
    </section>

    <section className="lovable-section lovable-section--soft">
      <div className="container-page premium-operations-grid">
        <div className="premium-operations-media">
          <img src="/images/replacement/warehouse-loading-branded.webp" alt="1st Class Express freight being coordinated for loading" width="1376" height="768" loading="lazy" decoding="async"/>
          <div><ClipboardCheck aria-hidden="true"/><strong>Planned around your operation</strong><span>Single movements, recurring runs, driver support and managed fleet requirements.</span></div>
        </div>
        <div>
          <p className="lovable-kicker">Operational Support</p>
          <h2>More Than Point-To-Point Transport</h2>
          <p>{companyProfile.about.paragraphs[4]}</p>
          <ul className="premium-check-list">
            {companyProfile.operations.slice(0, 6).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}
          </ul>
          <Link className="lovable-btn lovable-btn--ink" to="/about">How We Work <ArrowRight size={17} aria-hidden="true"/></Link>
        </div>
      </div>
    </section>

    <section className="lovable-section premium-process-section">
      <div className="container-page">
        <div className="lovable-heading"><p className="lovable-kicker">A Clear Freight Journey</p><h2>From Enquiry To Delivery Coordination</h2><p>Three practical stages keep the important details visible before a movement is confirmed.</p></div>
        <div className="premium-process-grid">
          {process.map(([number, title, text]) => <article key={number}><span>{number}</span><Route aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section id="quick-quote" className="lovable-section quick-quote-section">
      <div className="container-page quick-quote-grid">
        <div>
          <p className="lovable-kicker">Start The Conversation</p>
          <h2>Tell Us What Needs Moving</h2>
          <p>{companyProfile.homepage.detail}</p>
          <div className="quick-quote-assurance">
            <PackageCheck aria-hidden="true"/>
            <div><strong>Useful details get a useful response</strong><span>Include the freight type, pickup, destination, timing and anything unusual about access or handling.</span></div>
          </div>
          <a className="quick-quote-phone" href={phoneHref(company.phonePrimary)}><Phone aria-hidden="true"/> Prefer to speak? Call {company.phonePrimary}</a>
        </div>
        <QuickQuoteForm/>
      </div>
    </section>
  </>
}
