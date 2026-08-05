import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, BadgeCheck, Building2, CheckCircle2, Clock3, MapPinned, ShieldCheck, Truck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/common/ButtonLink'
import { CallToAction } from '../components/common/CallToAction'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { ContactForm } from '../components/forms/ContactForm'
import { AnimatedLogoIntro } from '../components/sections/AnimatedLogoIntro'
import { RouteMap } from '../components/sections/RouteMap'
import { ServiceCard } from '../components/sections/ServiceCard'
import { company, phoneHref } from '../data/company'
import { companyProfile } from '../data/companyProfile'
import { fleet } from '../data/fleet'
import { services } from '../data/services'

const trustIcons = [BadgeCheck, ShieldCheck, Building2, Clock3, CheckCircle2, MapPinned] as const

export default function HomePage() {
  const reduce = useReducedMotion()
  return <>
    <SeoHead {...routeSeo.home}/>
    <AnimatedLogoIntro/>
    <section className="home-hero"><div className="hero-media" aria-hidden="true"><img
          src="/images/generated/mercedes-actros-linehaul.jpg"
          alt=""
          width="1920"
          height="1080"
          loading="eager"
          decoding="async"
        /><img className="vehicle-brand-mark" src="/brand/first-class-express-logo.png" alt="" width="90" height="98" /></div><div className="hero-media-overlay" aria-hidden="true"/><div className="hero-grid" aria-hidden="true"/><div className="hero-glow" aria-hidden="true"/><div className="container-page hero-layout">
      <motion.div className="hero-copy" initial={reduce ? false : {opacity:0, y:26}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
        <p className="eyebrow hero-kicker"><span aria-hidden="true"/>Professional transport / Australia</p><h1 id="home-hero-title" tabIndex={-1}>{companyProfile.homepage.title}</h1><p className="hero-lead">{companyProfile.homepage.intro}</p><p className="hero-detail">{companyProfile.homepage.detail}</p>
        <div className="hero-actions"><ButtonLink to="/book-now">Request a quote <ArrowUpRight size={17}/></ButtonLink><ButtonLink to="/our-fleet" variant="secondary">View our fleet</ButtonLink></div>
        <p className="hero-supporting-line">{companyProfile.homepage.supportingLine}</p><div className="hero-trust hero-data"><span><Building2/><b>Australian owned</b><small>Privately operated</small></span><span><MapPinned/><b>Interstate capable</b><small>Local to linehaul</small></span><span><UsersRound/><b>Experienced team</b><small>Clear coordination</small></span></div>
      </motion.div>
      <motion.aside className="hero-art hero-dispatch-panel" initial={reduce ? false : {opacity:0, x:35, rotateY:-8}} animate={{opacity:1,x:0,rotateY:0}} transition={{duration:.8,delay:.15}} aria-label="Freight service overview"><div className="hero-route-card"><img src="/brand/first-class-express-logo.png" alt="1st Class Express" width="118" height="128"/><div><span>Service desk</span><strong>Plan the movement</strong><small>Tell us the freight, route and timing.</small></div></div><div className="freight-line"><Truck/><span/></div><p>Sydney <i/> Brisbane <i/> Melbourne <i/> Adelaide</p><Link to="/contact" className="dispatch-link">Talk to the team <ArrowUpRight size={16}/></Link></motion.aside>
    </div><a className="scroll-cue" href="#introduction"><ArrowDown/><span>Discover</span></a></section>

    <section id="introduction" className="section intro-section"><div className="container-page intro-grid"><div className="logo-panel"><p className="eyebrow">01 / Our business</p><img src="/brand/first-class-express-logo.png" loading="lazy" decoding="async" alt="1st Class Express" width="420" height="456"/></div><div><SectionHeading eyebrow="About 1st Class Express" title={companyProfile.about.title} intro={companyProfile.about.paragraphs[0]}/><p>{companyProfile.about.paragraphs[1]}</p><div className="intro-proof"><strong>{companyProfile.established}</strong><span>Freight delivery, dedicated drivers and managed fleet support planned around your operation.</span></div><ButtonLink to="/about-us" variant="secondary">Learn about our approach</ButtonLink></div></div></section>

    <section className="section services-section"><div className="container-page"><div className="section-heading-row"><SectionHeading eyebrow="02 / Freight capability" title="Flexible transport, one dependable team" intro="From time-sensitive deliveries to ongoing logistics support, every job begins with the right questions."/><Link to="/our-services" className="text-link">All services <ArrowUpRight size={16}/></Link></div><div className="service-grid">{services.slice(0,7).map((service,index)=><ServiceCard key={service.title} title={service.title} text={service.short} icon={service.icon} index={index}/>)}</div></div></section>

    <section className="uniform-band"><div className="container-page uniform-inner"><div className="uniform-icon"><UsersRound/></div><div><p className="eyebrow">03 / Professional driver solutions</p><h2>{companyProfile.driverSolutions.title}</h2><p>{companyProfile.driverSolutions.paragraphs[0]} Drivers can be allocated to dedicated delivery runs and presented as an extension of your organisation, by agreement and availability.</p></div><ButtonLink to="/our-services" variant="secondary">Explore driver solutions</ButtonLink></div></section>

    <section className="section fleet-showcase"><div className="container-page"><div className="fleet-heading"><SectionHeading eyebrow="The right vehicle" title="A fleet that scales with the freight" intro="Our vehicles range from 1 tonne vans to pallet trucks, sizing up to semi-trailers and B-double trailers."/><ButtonLink to="/our-fleet" variant="secondary">View the Fleet</ButtonLink></div><figure className="fleet-feature-image"><img src="/images/generated/kenworth-k220-linehaul.jpg" loading="lazy" decoding="async" width="1920" height="1080" alt="Kenworth K220 cab-over prime mover towing a B-double on an Australian highway"/><img className="vehicle-brand-mark" src="/brand/first-class-express-logo.png" loading="lazy" alt="" width="90" height="98"/><figcaption><span>Linehaul range</span><strong>Built for the long run</strong></figcaption></figure><div className="fleet-strip">{fleet.slice(0,5).map(({title,use,icon:Icon},i)=><article key={title}><span>0{i+1}</span><Icon/><h3>{title}</h3><p>{use}</p></article>)}</div></div></section>

    <section className="section people-section"><div className="container-page people-grid"><article><UsersRound/><p className="eyebrow">Our drivers</p><h2>Professional representation on every run</h2><p>{companyProfile.driverSolutions.paragraphs[1]}</p><Link to="/our-services">Explore driver solutions →</Link></article><article><Building2/><p className="eyebrow">Your operation</p><h2>Support that fits your operation</h2><p>From a single delivery to recurring transport, dedicated drivers and managed fleet support, services are structured around the schedule, freight and customer experience required.</p><Link to="/our-services">Explore operational support →</Link></article></div></section>

    <section className="section map-section"><div className="container-page"><SectionHeading eyebrow="Service area" title="Routes that connect business across Australia" intro="Local and regional coverage anchored by interstate capability across Australia’s major freight corridors."/><RouteMap/></div></section>

    <section className="section why-section"><div className="container-page"><SectionHeading eyebrow="Why 1st Class Express" title="Dependable support, clearly delivered" align="center"/><div className="trust-grid">{companyProfile.trust.map(({title,text}, index)=>{const Icon = trustIcons[index]!; return <article key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>})}</div></div></section>
    <section className="section benefits-section"><div className="container-page"><SectionHeading eyebrow="Business benefits" title="One partner across delivery, drivers and fleet support" intro="Practical capability for businesses that need flexible transport planning without unnecessary complexity."/><ul className="content-list-grid">{companyProfile.benefits.slice(0,9).map(item=><li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul><ButtonLink to="/book-now">Discuss your requirements</ButtonLink></div></section>
    <CallToAction/>
    <section className="section contact-preview"><div className="container-page contact-grid"><div><SectionHeading eyebrow="Start a conversation" title="Tell us where it needs to go" intro="Share the delivery details and our team will help assess the right transport approach."/><div className="contact-person"><span>D / D</span><div><strong>{company.contactName}</strong><small>{company.contactRole}</small></div></div><a href={phoneHref(company.phonePrimary)}>{company.phonePrimary}</a><p>Fleet Operations and Customer Support</p><a href={`mailto:${company.email}`}>{company.email}</a></div><ContactForm compact/></div></section>
  </>
}
