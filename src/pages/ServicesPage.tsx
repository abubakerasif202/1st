import { ArrowUpRight, BarChart3, CheckCircle2, ChevronRight, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/common/ButtonLink'
import { SeoHead } from '../components/common/SeoHead'
import { SectionHeading } from '../components/common/SectionHeading'
import { companyProfile } from '../data/companyProfile'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

export default function ServicesPage() {
  return <>
    <SeoHead {...routeSeo.services} />
    <section className="visual-page-hero visual-page-hero--services">
      <img src="/images/generated/fleet-lineup-branded.jpg" alt="Branded 1st Class Express vehicles lined up at an Australian transport depot" width="1920" height="1080" loading="eager" decoding="async" />
      <div className="visual-page-hero__shade" aria-hidden="true" />
      <div className="container-page visual-page-hero__content">
        <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} /><span>Our Services</span></nav>
        <p className="eyebrow">OUR SERVICES</p>
        <h1>Our World-Class Services</h1>
        <p>Professional Sydney metropolitan, regional and interstate support across freight delivery, dedicated drivers and managed fleet services.</p>
        <div className="hero-actions">
          <ButtonLink to="/book-now">Request a Quote</ButtonLink>
          <ButtonLink to="/contact" variant="secondary">Discuss Your Requirements</ButtonLink>
        </div>
      </div>
    </section>

    <section className="section service-catalog-section">
      <div className="container-page">
        <SectionHeading eyebrow="Service categories" title="Transport services planned around freight, timing and operating requirements" intro="Each service starts with the freight details, pickup, destination, timing and any specialist handling requirements." />
        <div className="image-service-grid">
          {services.map(({ title, detail, short, image, icon: Icon }) => <article key={title} className="image-service-card">
            <div className="image-service-card__media">
              <img src={image} alt={`${title} service support from 1st Class Express`} width="1920" height="1080" loading="lazy" decoding="async" />
              <Icon aria-hidden="true" />
            </div>
            <div className="image-service-card__body">
              <h2>{title}</h2>
              <p>{short}</p>
              <p className="operational-note"><strong>Operational detail:</strong> {detail}</p>
              <Link to="/book-now" aria-label={`Request a quote for ${title}`}>Request this service <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section driver-solutions-section">
      <div className="container-page driver-solutions-grid">
        <div>
          <SectionHeading eyebrow="Professional driver solutions" title={companyProfile.driverSolutions.title} intro={companyProfile.driverSolutions.paragraphs[0]} />
          {companyProfile.driverSolutions.paragraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <p className="qualification-note">Driver placement, uniforms and dedicated allocation are confirmed by agreement, assessment and availability.</p>
          <ButtonLink to="/contact" variant="secondary">Discuss Driver Support</ButtonLink>
        </div>
        <ul className="content-list-grid content-list-grid--light">
          {companyProfile.driverSolutions.standards.map(item => <li key={item}><UsersRound aria-hidden="true" />{item}</li>)}
        </ul>
      </div>
    </section>

    <section className="section operational-support-section">
      <div className="container-page">
        <SectionHeading eyebrow="Operational support" title="Performance monitoring and continuity planning for delivery operations" intro="Support can extend beyond the run itself, helping customers plan resources, coverage and continuous improvement." />
        <ul className="content-list-grid">
          {companyProfile.operations.map(item => <li key={item}><BarChart3 aria-hidden="true" />{item}</li>)}
        </ul>
      </div>
    </section>

    <section className="section service-assessment-section">
      <div className="container-page service-assessment-panel">
        <CheckCircle2 aria-hidden="true" />
        <div>
          <p className="eyebrow">Assessment first</p>
          <h2>Specialist freight is checked before acceptance</h2>
          <p>Dangerous-goods transport is subject to freight classification, regulatory requirements, suitable equipment, qualified personnel and booking assessment.</p>
        </div>
        <ButtonLink to="/book-now">Get a Quote</ButtonLink>
      </div>
    </section>

    <section className="final-image-cta">
      <img src="/images/generated/hero-interstate-truck-branded.jpg" alt="Branded 1st Class Express interstate truck on an Australian highway at sunset" width="1920" height="1080" loading="lazy" decoding="async" />
      <div className="container-page final-image-cta__content">
        <p className="eyebrow">Next step</p>
        <h2>Ready to Get Started?</h2>
        <p>Discuss your freight, timing, driver or fleet requirements and receive a tailored transport assessment.</p>
        <ButtonLink to="/book-now">Get a Quote</ButtonLink>
      </div>
    </section>
  </>
}
