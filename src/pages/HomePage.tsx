import { ArrowRight, CheckCircle2, Clock3, Headphones, MapPinned, PackageCheck, Phone, Route, ShieldCheck, Truck, UserRoundCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { company, phoneHref } from '../data/company'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

const fleetCards = [
  ['1-Tonne Vans', '/images/generated/fleet-lineup-branded.jpg', 'Smaller consignments, urgent items and metropolitan runs.'],
  ['Pallet Trucks', '/images/generated/services-collage-branded.jpg', 'Palletised freight with practical loading and delivery access.'],
  ['Rigid Trucks', '/images/generated/operations-collage-branded.jpg', 'Mixed loads, multi-drop work and larger commercial deliveries.'],
  ['Prime Movers', '/images/generated/mercedes-actros-linehaul-branded.jpg', 'Linehaul capability matched to the required trailer configuration.'],
  ['Semi-Trailers', '/images/generated/mercedes-actros-linehaul-branded.jpg', 'Larger consignments moving between metropolitan and regional destinations.'],
  ['B-Double Configurations', '/images/generated/hero-kenworth-linehaul.jpg', 'Higher-volume linehaul on approved routes, subject to freight assessment.'],
] as const

const reasons = [
  ['Reliable Transport', 'Movements are planned before the vehicle rolls, with pickup and delivery expectations agreed up front.', Route],
  ['Quality Service', 'Our name sets the standard from the first phone call through to final delivery.', PackageCheck],
  ['Professional Drivers', 'Experienced transport personnel who present professionally and handle freight with care.', UserRoundCheck],
  ['Australia-Wide Capability', 'Metropolitan, regional and interstate movements coordinated around route and freight requirements.', MapPinned],
  ['Flexible Scheduling', 'Same day, next day, after-hours and weekend options where the route allows it.', Clock3],
  ['Competitive Solutions', 'Transport options shaped around your actual freight profile rather than a fixed template.', ShieldCheck],
] as const

const areas = ['Sydney Metropolitan Area','Sydney CBD','Wollongong','Canberra','Wagga Wagga','Narrandera','Griffith','Albury','Blue Mountains','Lithgow','Bathurst','Orange','Mudgee','Dubbo','Parkes','Central Coast','Newcastle','Muswellbrook','Tamworth']

export default function HomePage() {
  return <>
    <SeoHead {...routeSeo.home}/>

    <section className="lovable-hero" aria-labelledby="home-title">
      <div className="lovable-hero__image"><img src="/images/generated/hero-kenworth-linehaul.jpg" alt="Black 1st Class Express B-double prime mover on an Australian highway" width="1536" height="1024" loading="eager" decoding="async"/></div>
      <div className="lovable-hero__overlay" aria-hidden="true"/>
      <div className="container-page lovable-hero__content">
        <p className="lovable-kicker">Committed to Delivering a Quality Service</p>
        <h1 id="home-title">Freight Moved First Class</h1>
        <p className="lovable-hero__lead">Australian owned transport, linehaul and logistics. From urgent same day runs to interstate B-double movements, we plan the job properly and keep you informed until it lands.</p>
        <div className="lovable-actions">
          <Link className="lovable-btn lovable-btn--primary" to="/book-now">Request a Quote <ArrowRight size={18}/></Link>
          <a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18}/> {company.phonePrimary}</a>
        </div>
      </div>
    </section>

    <div className="lovable-stats"><div className="container-page lovable-stats__grid">
      <div className="lovable-stat"><strong>6+</strong><span>Vehicle Types</span></div>
      <div className="lovable-stat"><strong>8</strong><span>Transport Services</span></div>
      <div className="lovable-stat"><strong>19+</strong><span>Service Areas</span></div>
    </div></div>

    <section className="lovable-section lovable-section--dark"><div className="container-page lovable-split">
      <div>
        <div className="lovable-heading"><p className="lovable-kicker">Urgent freight support</p><h2>Need It Moved Today?</h2><p>Send through the pickup, delivery and freight details and our team will confirm the transport requirements for your run.</p></div>
        <div className="lovable-feature-grid">
          <div className="lovable-feature"><CheckCircle2/><h3>Same day and next day</h3><p>Responsive options for time-sensitive movements.</p></div>
          <div className="lovable-feature"><Clock3/><h3>After-hours support</h3><p>Weekend and after-hours movements where available.</p></div>
          <div className="lovable-feature"><Truck/><h3>Vans to B-doubles</h3><p>Vehicle selection matched to your freight profile.</p></div>
        </div>
        <div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/book-now">Start Your Enquiry</Link><a className="lovable-btn lovable-btn--secondary" href={`mailto:${company.email}`}>Email Our Team</a></div>
      </div>
      <div className="lovable-split__image"><img src="/images/generated/operations-collage-branded.jpg" alt="1st Class Express freight and logistics operations" width="1536" height="1024" loading="lazy"/></div>
    </div></section>

    <section className="lovable-section"><div className="container-page">
      <div className="lovable-heading"><p className="lovable-kicker">Our Services</p><h2>Transport Services That Fit The Job</h2><p>Eight services covering urgent metropolitan runs, interstate linehaul, bulk freight and the logistics support around them.</p></div>
      <div className="lovable-service-grid">{services.slice(0,8).map(({title, short, icon: Icon}) => <article className="lovable-service-card" key={title}><Icon size={28}/><h3>{title}</h3><p>{short}</p><Link to="/our-services">Learn more <ArrowRight size={15}/></Link></article>)}</div>
    </div></section>

    <section className="lovable-section lovable-section--soft"><div className="container-page lovable-split">
      <div><div className="lovable-heading"><p className="lovable-kicker">About Us</p><h2>Australian Owned, Freight Focused</h2><p>1st Class Express is an Australian privately owned transport company providing linehaul, logistics and freight delivery services. We work with businesses requiring responsive communication, flexible transport options and dependable delivery coordination.</p></div><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/about-us">More About Us</Link><Link className="lovable-btn lovable-btn--secondary" style={{color:'#0b1117',borderColor:'#b9c0c5'}} to="/our-fleet">See Our Fleet</Link></div></div>
      <div className="lovable-split__image"><img src="/images/generated/mercedes-actros-linehaul-branded.jpg" alt="Silver 1st Class Express prime mover and semi-trailer on an Australian highway" width="1536" height="1024" loading="lazy"/></div>
    </div></section>

    <section className="lovable-section lovable-section--dark"><div className="container-page">
      <div className="lovable-heading"><p className="lovable-kicker">Our Fleet</p><h2>Vans Through To B-Doubles</h2><p>Vehicle selection depends on freight size, weight, route, access and handling requirements.</p></div>
      <div className="lovable-fleet-grid">{fleetCards.map(([title,image,text]) => <article className="lovable-fleet-card" key={title}><img src={image} alt={`1st Class Express ${title}`} loading="lazy"/><div className="lovable-fleet-card__copy"><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      <div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/our-fleet">Explore Our Fleet</Link></div>
    </div></section>

    <section className="lovable-section"><div className="container-page">
      <div className="lovable-heading"><p className="lovable-kicker">Why Choose Us</p><h2>Reliable By Design</h2></div>
      <div className="lovable-feature-grid">{reasons.map(([title,text,Icon]) => <article className="lovable-feature" style={{background:'#fff',color:'#0b1117',borderColor:'#dfe3e6'}} key={title}><Icon/><h3>{title}</h3><p style={{color:'#5f6b73'}}>{text}</p></article>)}</div>
    </div></section>

    <section className="lovable-section lovable-section--soft"><div className="container-page">
      <div className="lovable-heading"><p className="lovable-kicker">How It Works</p><h2>From Enquiry To Delivery</h2></div>
      <div className="lovable-process"><article><b>01</b><h3>Tell Us About the Freight</h3><p>Send through what needs to move, where it is going and when it needs to arrive.</p></article><article><b>02</b><h3>We Confirm the Transport Requirements</h3><p>We review the route, freight profile, handling needs and vehicle configuration.</p></article><article><b>03</b><h3>Pickup and Delivery Are Coordinated</h3><p>Once confirmed, we schedule the run and keep you informed from collection through delivery.</p></article></div>
    </div></section>

    <section className="lovable-section"><div className="container-page lovable-split">
      <div><div className="lovable-heading"><p className="lovable-kicker">Service Areas</p><h2>Where We Deliver</h2><p>Sydney and metropolitan NSW, regional New South Wales, the ACT and interstate routes between major Australian destinations.</p></div><div className="lovable-area-list">{areas.map(area => <span key={area}>{area}</span>)}</div><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/service-areas">View Service Areas</Link></div></div>
      <div className="lovable-split__image"><img src="/images/generated/fleet-lineup-branded.jpg" alt="1st Class Express fleet lined up at sunset" width="1536" height="1024" loading="lazy"/></div>
    </div></section>

    <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Ready When You Are</p><h2>Get Your Freight Moving Today</h2><p>Tell us what needs to move and when it has to arrive. We will confirm the vehicle, timing and route requirements.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/book-now">Request a Quote</Link><a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18}/>Call {company.phonePrimary}</a></div></div></section>
  </>
}
