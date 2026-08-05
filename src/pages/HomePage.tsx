import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck, Building2, CheckCircle2, ClipboardList, Headphones, MapPinned, Phone, Route, ShieldCheck, Truck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/common/ButtonLink'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'
import { ServiceCard } from '../components/sections/ServiceCard'
import { company, phoneHref } from '../data/company'
import { companyProfile } from '../data/companyProfile'
import { fleet } from '../data/fleet'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

const processSteps = [
  { number: '01', title: 'Share the job', text: 'Tell us the pickup, destination, timing and what you need moved.', icon: ClipboardList },
  { number: '02', title: 'We plan the movement', text: 'Our team assesses the freight, route and right vehicle for the run.', icon: Route },
  { number: '03', title: 'Your freight is delivered', text: 'A professional driver completes the job with clear communication throughout.', icon: Truck },
] as const

const credibilityPoints = [
  ['Professional drivers', 'Experienced, checked and prepared to represent your business well.', UserRoundCheck],
  ['Safety-led operations', 'Freight handling and transport planning aligned with operational requirements.', ShieldCheck],
  ['Dependable communication', 'Clear coordination from the first enquiry through to final delivery.', Headphones],
] as const

const featuredFleet = [fleet[4], fleet[5]] as const

export default function HomePage() {
  const reduce = useReducedMotion()

  return <>
    <SeoHead {...routeSeo.home}/>

    <section className="home-hero conversion-hero" aria-labelledby="home-hero-title">
      <div className="hero-media" aria-hidden="true"><img src="/images/generated/hero-kenworth-linehaul.jpg" alt="" width="1536" height="1024" loading="eager" decoding="async"/></div>
      <div className="hero-media-overlay" aria-hidden="true"/>
      <div className="hero-grid" aria-hidden="true"/>
      <div className="container-page hero-layout conversion-hero__layout">
        <motion.div className="hero-copy conversion-hero__content" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <p className="eyebrow hero-kicker"><span aria-hidden="true"/>Sydney freight / Interstate transport</p>
          <h1 id="home-hero-title" tabIndex={-1}>{companyProfile.homepage.title}</h1>
          <p className="hero-lead">{companyProfile.homepage.intro}</p>
          <p className="hero-detail">{companyProfile.homepage.detail}</p>
          <div className="hero-actions conversion-hero__actions">
            <a className="btn-primary" href="#quick-quote">Get a Free Quote <ArrowUpRight size={17} aria-hidden="true"/></a>
            <ButtonLink to="/our-fleet" variant="secondary">Explore Our Fleet</ButtonLink>
          </div>
          <p className="hero-supporting-line">{companyProfile.homepage.supportingLine}</p>
        </motion.div>

        <motion.aside className="conversion-hero__panel" initial={reduce ? false : { opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .12 }} aria-label="Quote support">
          <img src="/brand/first-class-express-logo.png" alt="1st Class Express" width="112" height="122"/>
          <p className="eyebrow">Ready to move freight?</p>
          <h2>One enquiry. The right transport plan.</h2>
          <ul>
            <li><CheckCircle2 aria-hidden="true"/>Local and interstate capability</li>
            <li><CheckCircle2 aria-hidden="true"/>Vans through to prime movers</li>
            <li><CheckCircle2 aria-hidden="true"/>Flexible business delivery support</li>
          </ul>
          <a href={phoneHref(company.phonePrimary)}><Phone size={17} aria-hidden="true"/>Call {company.phonePrimary}</a>
        </motion.aside>
      </div>
    </section>

    <section className="home-trust-bar" aria-label="Why businesses choose 1st Class Express"><div className="container-page home-trust-grid">
      <span><BadgeCheck aria-hidden="true"/><b>Established 2013</b><small>More than a decade in transport</small></span>
      <span><Building2 aria-hidden="true"/><b>Australian owned</b><small>Privately operated</small></span>
      <span><MapPinned aria-hidden="true"/><b>Sydney based</b><small>Local and regional support</small></span>
      <span><Truck aria-hidden="true"/><b>Interstate capable</b><small>Major Australian freight corridors</small></span>
    </div></section>

    <section className="section fleet-proof-section"><div className="container-page">
      <div className="fleet-proof-heading"><SectionHeading eyebrow="Fleet capability" title="The right vehicle makes the difference" intro="From agile metropolitan work to assessed interstate linehaul, our fleet is matched to the freight, access requirements and delivery window."/><ButtonLink to="/our-fleet" variant="secondary">View Every Vehicle</ButtonLink></div>
      <div className="fleet-proof-grid">
        <figure className="fleet-proof-primary">
          <img src="/images/generated/operations-collage-branded.jpg" alt="1st Class Express branded trucks, vans, warehouse and logistics operations" width="1536" height="1024" loading="lazy" decoding="async"/>
          <figcaption><span>Complete fleet range</span><strong>Built around the job—not a one-size-fits-all service.</strong></figcaption>
        </figure>
        <div className="fleet-proof-models">
          {featuredFleet.map(vehicle => <article key={vehicle.title}>
            <img src={vehicle.image} alt={`Branded 1st Class Express ${vehicle.title} linehaul truck`} width="1920" height="1080" loading="lazy" decoding="async"/>
            <div><vehicle.icon aria-hidden="true"/><span>{vehicle.serviceType}</span><h3>{vehicle.title}</h3><p>{vehicle.use}</p></div>
          </article>)}
        </div>
      </div>
    </div></section>

    <section className="section services-section"><div className="container-page">
      <div className="section-heading-row"><SectionHeading eyebrow="Freight services" title="Six ways we keep business moving" intro="Practical delivery solutions shaped around timing, freight type and operational needs."/><Link to="/our-services" className="text-link">Explore all services <ArrowUpRight size={16} aria-hidden="true"/></Link></div>
      <div className="service-grid">{services.slice(0, 6).map((service, index) => <ServiceCard key={service.title} title={service.title} text={service.short} icon={service.icon} index={index}/>)}</div>
    </div></section>

    <section className="section process-section"><div className="container-page">
      <SectionHeading eyebrow="Simple from the start" title="From quote request to delivered freight" intro="A clear three-step process keeps the job moving and gives you one accountable transport team." align="center"/>
      <div className="process-grid">{processSteps.map(({ number, title, text, icon: Icon }) => <article key={number}><span>{number}</span><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>

    <section className="section credibility-section"><div className="container-page credibility-grid">
      <div>
        <SectionHeading eyebrow="Confidence on every run" title="Professional delivery is more than the truck" intro="The driver, planning and communication behind each movement matter just as much as the vehicle."/>
        <p>{companyProfile.commitment.intro}</p>
        <ButtonLink to="/about-us" variant="secondary">Why Businesses Choose Us</ButtonLink>
      </div>
      <div className="credibility-list">{credibilityPoints.map(([title, text, Icon]) => <article key={title}><Icon aria-hidden="true"/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </div></section>

    <section id="quick-quote" className="section quick-quote-section" aria-labelledby="quick-quote-title"><div className="container-page quick-quote-grid">
      <div className="quick-quote-copy">
        <p className="eyebrow">Get a free freight quote</p>
        <h2 id="quick-quote-title">Tell us what needs to move.</h2>
        <p>Share the essential details and our team will assess the route, freight and suitable vehicle. For urgent work, call us directly.</p>
        <a className="quick-quote-phone" href={phoneHref(company.phonePrimary)}><Phone aria-hidden="true"/><span><small>Talk to the transport team</small><strong>{company.phonePrimary}</strong></span></a>
        <ul><li><CheckCircle2 aria-hidden="true"/>No-obligation enquiry</li><li><CheckCircle2 aria-hidden="true"/>Local and interstate assessment</li><li><CheckCircle2 aria-hidden="true"/>Direct response from our team</li></ul>
      </div>
      <div className="quick-quote-card"><QuickQuoteForm/></div>
    </div></section>
  </>
}
