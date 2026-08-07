import { ArrowRight, CheckCircle2, Clock3, MapPinned, PackageCheck, Phone, Route, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { AnimatedLogoIntro } from '../components/sections/AnimatedLogoIntro'
import { FreightJourney } from '../components/sections/FreightJourney'
import { company, phoneHref } from '../data/company'
import { fleet } from '../data/fleet'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

const reasons = [
  ['Reliable Transport', 'Every movement is planned around the freight, route and delivery window.', Route],
  ['Quality Service', 'Clear communication from the first enquiry through to final delivery.', PackageCheck],
  ['Professional Drivers', 'Experienced personnel who present professionally and handle freight with care.', UserRoundCheck],
  ['Australia-Wide Capability', 'Metropolitan, regional and interstate movements coordinated by our team.', MapPinned],
  ['Flexible Scheduling', 'Same day, next day, after-hours and weekend options where available.', Clock3],
  ['Competitive Solutions', 'Transport options shaped around your freight instead of a fixed template.', ShieldCheck],
] as const

export default function HomePage() {
  return <>
    <SeoHead {...routeSeo.home}/>
    <AnimatedLogoIntro/>
    <section className="lovable-hero" aria-labelledby="home-hero-title">
      <img className="lovable-hero__image" src="/images/replacement/prime-mover-network-hero.png" alt="1st Class Express branded prime mover on an Australian highway with an overlaid map of interstate freight routes connecting major Australian cities" width="1672" height="941" loading="eager" decoding="async"/>
      <div className="lovable-hero__overlay" aria-hidden="true"/>
      <div className="container-page lovable-hero__grid">
        <div className="lovable-hero__copy">
          <p className="lovable-kicker">Australian Owned Transport</p>
          <h1 id="home-hero-title" tabIndex={-1}>Freight Moved First Class</h1>
          <p className="lovable-hero__lead">Australian owned transport, linehaul and logistics. From urgent same day runs to interstate B-double movements, we plan the job properly and keep you informed until it lands.</p>
          <div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote <ArrowRight size={18}/></Link><a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18}/>{company.phonePrimary}</a></div>
        </div>
        <aside className="hero-enquiry-card">
          <img src="/brand/first-class-express-logo.webp" alt="" width="72" height="78"/>
          <p className="lovable-kicker">Urgent freight support</p><h2>Need It Moved Today?</h2>
          <ul><li><CheckCircle2/>Same day and next day options</li><li><CheckCircle2/>After-hours and weekend movements</li><li><CheckCircle2/>Vans through to B-double configurations</li></ul>
          <Link to="/quote">Request a Quote <ArrowRight size={17}/></Link>
        </aside>
      </div>
    </section>

    <div className="lovable-stats"><div className="container-page lovable-stats__grid"><div className="lovable-stat"><strong>6+</strong><span>Vehicle Types</span></div><div className="lovable-stat"><strong>8</strong><span>Transport Services</span></div><div className="lovable-stat"><strong>19+</strong><span>Service Areas</span></div></div></div>

    <section className="lovable-section"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Our Services</p><h2>Transport Services That Fit The Job</h2><p>Urgent metropolitan runs, interstate linehaul, bulk freight and the logistics support around them.</p></div><div className="lovable-service-grid">{services.map(({id,title,short,icon:Icon})=><article className="lovable-service-card" key={id}><Icon/><h3>{title}</h3><p>{short}</p><Link to={`/services#${id}`}>Learn more <ArrowRight size={15}/></Link></article>)}</div></div></section>

    <section className="lovable-section lovable-section--soft"><div className="container-page lovable-split"><div><div className="lovable-heading"><p className="lovable-kicker">About Us</p><h2>Australian Owned, Freight Focused</h2><p>1st Class Express is an Australian privately owned transport company providing linehaul, logistics and freight delivery services. We work with businesses requiring responsive communication, flexible transport options and dependable delivery coordination.</p></div><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/about">More About Us</Link><Link className="lovable-btn lovable-btn--ink" to="/fleet">See Our Fleet</Link></div></div><div className="lovable-split__image"><img src="/images/replacement/warehouse-loading-branded.png" alt="1st Class Express branded freight loading operation" loading="lazy"/></div></div></section>

    <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Our Fleet</p><h2>Vans Through To B-Doubles</h2><p>Vehicle selection depends on freight size, weight, route, access and handling requirements.</p></div><div className="lovable-fleet-grid">{fleet.map(({title,image,use})=><article className="lovable-fleet-card" key={title}><img src={image} alt={`1st Class Express ${title}`} loading="lazy"/><div className="lovable-fleet-card__copy"><h3>{title}</h3><p>{use}</p></div></article>)}</div><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/fleet">Explore Our Fleet</Link></div></div></section>

    <section className="lovable-section"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Why Choose Us</p><h2>Reliable By Design</h2></div><div className="lovable-feature-grid">{reasons.map(([title,text,Icon])=><article className="lovable-feature" key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">How Your Freight Moves</p><h2>From Quote To Delivery Confirmation</h2><p>Every job follows the same disciplined process, whether it is a metropolitan drop-off or an interstate linehaul run.</p></div><FreightJourney/></div></section>

    <section className="lovable-section"><div className="container-page lovable-split"><div><div className="lovable-heading"><p className="lovable-kicker">Service Areas</p><h2>Where We Deliver</h2><p>Sydney and metropolitan NSW, regional New South Wales, the ACT and interstate routes between major Australian destinations.</p></div><div className="lovable-area-list">{company.serviceAreas.map(area=><span key={area}>{area}</span>)}</div><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/service-areas">View Service Areas</Link></div></div><div className="lovable-split__image"><img src="/images/replacement/complete-fleet-lineup-branded.png" alt="1st Class Express branded fleet lineup" loading="lazy"/></div></div></section>

    <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Ready When You Are</p><h2>Get Your Freight Moving Today</h2><p>Tell us what needs to move and when it has to arrive. We will confirm the vehicle, timing and route requirements.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Quote</Link><a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18}/>Call {company.phonePrimary}</a></div></div></section>
  </>
}
