import { ArrowUpRight, CheckCircle2, ChevronRight, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/common/ButtonLink'
import { SeoHead } from '../components/common/SeoHead'
import { SectionHeading } from '../components/common/SectionHeading'
import { fleet } from '../data/fleet'
import routeSeo from '../data/routeSeo.json'

const fleetSupport = [
  'Short-term fleet coverage',
  'Long-term fleet solutions',
  'Dedicated client vehicles',
  'Driver and vehicle combinations',
  'Backup vehicle and driver planning',
  'Peak-demand support',
  'Ongoing managed fleet services',
  'Fleet supervision',
  'Route and run reviews',
] as const

export default function FleetPage() {
  return <>
    <SeoHead {...routeSeo.fleet} />
    <section className="visual-page-hero visual-page-hero--fleet">
      <img src="/images/generated/hero-kenworth-linehaul.jpg" alt="Black branded 1st Class Express prime mover travelling on an Australian highway at sunset" width="1536" height="1024" loading="eager" decoding="async" />
      <div className="visual-page-hero__shade" aria-hidden="true" />
      <div className="container-page visual-page-hero__content">
        <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} /><span>Our Fleet</span></nav>
        <p className="eyebrow">OUR FLEET</p>
        <h1>Our World-Class Fleet</h1>
        <p>Professional vehicle and managed-fleet options for freight, route and service requirements across Sydney and interstate operations.</p>
        <div className="hero-actions">
          <ButtonLink to="/contact">Discuss Your Fleet Requirements</ButtonLink>
          <ButtonLink to="/book-now" variant="secondary">Request a Quote</ButtonLink>
        </div>
      </div>
    </section>

    <section className="section fleet-intro-section">
      <div className="container-page fleet-intro-grid">
        <SectionHeading eyebrow="Vehicle planning" title="Vehicles matched to the freight, route and service requirement" intro="Availability and configuration are confirmed for each booking, with support ranging from individual vehicles to dedicated and managed fleet arrangements." />
        <div className="fleet-intro-panel">
          <Truck aria-hidden="true" />
          <p>Final vehicle selection is confirmed after freight assessment. Capacities, specialist requirements and route suitability are checked before work is accepted.</p>
        </div>
      </div>
    </section>

    <section className="section fleet-details-section">
      <div className="container-page">
        <SectionHeading eyebrow="Fleet details" title="Vehicle options for practical Australian transport work" intro="Each option is presented as an assessed service category rather than a fixed technical specification." />
        <div className="fleet-detail-grid">
          {fleet.map(({ title, use, bestFor, serviceType, availability, image, icon: Icon }) => <article key={title} className="fleet-detail-card">
            <div className="fleet-detail-card__image">
              <img src={image} alt={`${title} available through 1st Class Express fleet support`} width="1920" height="1080" loading="lazy" decoding="async" />
            </div>
            <div className="fleet-detail-card__body">
              <div className="fleet-detail-card__heading"><Icon aria-hidden="true" /><h2>{title}</h2></div>
              <p>{use}</p>
              <dl>
                <div><dt>Best suited for</dt><dd>{bestFor}</dd></div>
                <div><dt>Service type</dt><dd>{serviceType}</dd></div>
                <div><dt>Availability</dt><dd>{availability}</dd></div>
              </dl>
              <ButtonLink to="/book-now" variant="secondary" ariaLabel={`Ask about ${title}`}>Ask About This Vehicle</ButtonLink>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section linehaul-showcase">
      <div className="container-page">
        <SectionHeading eyebrow="Featured linehaul" title="Two premium model options for assessed interstate work" intro="Mercedes-Benz Actros and Kenworth K220 imagery is retained and now carries 1st Class Express branding in the image artwork." />
        <div className="linehaul-model-grid">
          <article>
            <img src="/images/generated/mercedes-actros-linehaul-branded.jpg" alt="White branded Mercedes-Benz Actros prime mover with enclosed semi-trailer on a regional highway" width="1536" height="1024" loading="lazy" decoding="async" />
            <div>
              <p className="eyebrow">Mercedes-Benz Actros</p>
              <h2>Modern prime-mover support</h2>
              <p>Interstate and enclosed freight support, with availability confirmed for each job.</p>
              <Link to="/book-now">Discuss Actros availability <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </article>
          <article>
            <img src="/images/generated/hero-kenworth-linehaul.jpg" alt="Black branded cab-over linehaul truck with B-double trailers on an Australian highway" width="1536" height="1024" loading="lazy" decoding="async" />
            <div>
              <p className="eyebrow">Kenworth K220</p>
              <h2>Australian cab-over linehaul option</h2>
              <p>Assessed high-capacity or B-double movements, with configuration confirmed before booking.</p>
              <Link to="/book-now">Discuss K220 configuration <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="section fleet-support-section">
      <div className="container-page">
        <SectionHeading eyebrow="Managed fleet support" title="Short-term coverage through to ongoing managed fleet services" intro="Fleet and driver support can be structured around regular runs, seasonal demand, business growth and continuity planning." />
        <ul className="content-list-grid">
          {fleetSupport.map(item => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}
        </ul>
        <p className="qualification-note">Driver allocation, client vehicle arrangements and backup coverage are subject to assessment, agreement and availability.</p>
      </div>
    </section>

    <section className="final-image-cta">
      <img src="/images/generated/fleet-lineup-branded.jpg" alt="Branded 1st Class Express van, rigid truck and prime mover fleet lineup" width="2048" height="682" loading="lazy" decoding="async" />
      <div className="container-page final-image-cta__content">
        <p className="eyebrow">Final step</p>
        <h2>Ready to Move Your Goods?</h2>
        <p>Tell us what you are moving, where it needs to go and the support your operation requires.</p>
        <ButtonLink to="/book-now">Get a Tailored Quote</ButtonLink>
      </div>
    </section>
  </>
}
