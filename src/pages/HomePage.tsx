import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, BadgeCheck, Building2, CheckCircle2, Clock3, MapPinned, ShieldCheck, Truck, UsersRound } from 'lucide-react'
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
import { fleet } from '../data/fleet'
import { services } from '../data/services'

const trust = [
  {title:'Committed', text:'Focused on dependable service from booking to delivery.', icon:BadgeCheck},
  {title:'Quality Service', text:'Professional freight handling and clear communication.', icon:ShieldCheck},
  {title:'Peace of Mind', text:'Practical coordination for every stage of the movement.', icon:CheckCircle2},
  {title:'Australian', text:'An Australian privately owned transport company.', icon:MapPinned},
  {title:'10 Years', text:'Longstanding transport and logistics experience supporting the way we work.', icon:Clock3},
  {title:'Best Prices', text:'Competitive solutions assessed for your actual requirements.', icon:Building2},
]

export default function HomePage() {
  const reduce = useReducedMotion()
  return <>
    <SeoHead {...routeSeo.home}/>
    <AnimatedLogoIntro/>
    <section className="home-hero"><div className="hero-media" aria-hidden="true"><img src="/images/generated/mercedes-actros-linehaul.jpg" alt="" fetchPriority="high" decoding="async" /></div><div className="hero-media-overlay" aria-hidden="true"/><div className="hero-grid" aria-hidden="true"/><div className="hero-glow" aria-hidden="true"/><div className="container-page hero-layout">
      <motion.div className="hero-copy" initial={reduce ? false : {opacity:0, y:26}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
        <p className="eyebrow">Australia-wide freight support</p><h1 id="home-hero-title" tabIndex={-1}>Moving Your Freight <span>Interstate</span></h1><p className="hero-lead">Linehaul and interstate transport services Australia-wide.</p><p className="hero-detail">Professional support for local deliveries, major freight movements and the customer-facing final mile.</p>
        <div className="hero-actions"><ButtonLink to="/book-now">Get a Free Quote</ButtonLink><ButtonLink to="/our-fleet" variant="secondary">Explore Our Fleet</ButtonLink></div>
        <div className="hero-trust"><span><Building2/>Australian privately owned</span><span><MapPinned/>Interstate coverage</span><span><UsersRound/>Experienced operators</span></div>
      </motion.div>
      <motion.div className="hero-art" initial={reduce ? false : {opacity:0, x:35, rotateY:-8}} animate={{opacity:1,x:0,rotateY:0}} transition={{duration:.8,delay:.15}}><div className="hero-route-card"><img src="/brand/first-class-express-logo.png" alt="1st Class Express" width="118" height="128"/><div><span>Interstate network</span><strong>Five capital routes</strong><small>Metro • Regional • Linehaul</small></div></div><div className="freight-line"><Truck/><span/></div><p>Sydney <i/> Brisbane <i/> Melbourne <i/> Adelaide</p></motion.div>
    </div><a className="scroll-cue" href="#introduction"><ArrowDown/><span>Discover</span></a></section>

    <section id="introduction" className="section intro-section"><div className="container-page intro-grid"><div className="logo-panel"><img src="/brand/first-class-express-logo.png" loading="lazy" alt="1st Class Express" width="420" height="456"/></div><div><SectionHeading eyebrow="Our company" title="Freight support backed by industry experience" intro="Backed by industry professionals, 1st Class Express offers local, linehaul and interstate transport services throughout Australia."/><p>The team brings recognised Asia-Pacific transport and logistics experience, with a practical focus on communication, freight care and reliable coordination.</p><strong>We are an Australian privately owned company.</strong><ButtonLink to="/about-us" variant="secondary">Meet 1st Class Express</ButtonLink></div></div></section>

    <section className="section services-section"><div className="container-page"><SectionHeading eyebrow="What we move" title="Flexible transport, one dependable team" intro="From time-sensitive deliveries to ongoing logistics support, every job begins with the right questions."/><div className="service-grid">{services.slice(0,7).map((service,index)=><ServiceCard key={service.title} title={service.title} text={service.short} icon={service.icon} index={index}/>)}</div></div></section>

    <section className="uniform-band"><div className="container-page uniform-inner"><div className="uniform-icon"><UsersRound/></div><div><p className="eyebrow">Your brand, professionally represented</p><h2>Customer-facing delivery support</h2><p>Drivers can be uniformed to represent your business at the customer-facing stage of delivery, arranged by agreement.</p></div><ButtonLink to="/contact" variant="secondary">Discuss Your Requirements</ButtonLink></div></section>

    <section className="section fleet-showcase"><div className="container-page"><div className="fleet-heading"><SectionHeading eyebrow="The right vehicle" title="A fleet that scales with the freight" intro="Our vehicles range from 1 tonne vans to pallet trucks, sizing up to semi-trailers and B-double trailers."/><ButtonLink to="/our-fleet" variant="secondary">View the Fleet</ButtonLink></div><figure className="fleet-feature-image"><img src="/images/generated/kenworth-k220-linehaul.jpg" loading="lazy" decoding="async" width="1920" height="1080" alt="Kenworth K220 cab-over prime mover towing a B-double on an Australian highway"/><figcaption><span>Linehaul range</span><strong>Built for the long run</strong></figcaption></figure><div className="fleet-strip">{fleet.slice(0,5).map(({title,use,icon:Icon},i)=><article key={title}><span>0{i+1}</span><Icon/><h3>{title}</h3><p>{use}</p></article>)}</div></div></section>

    <section className="section people-section"><div className="container-page people-grid"><article><UsersRound/><p className="eyebrow">Our drivers</p><h2>Experience behind every movement</h2><p>Drivers are selected for experience, with police checks forming part of the process. Safety, goods care, route knowledge and communication are priorities throughout the delivery.</p><Link to="/about-us">How we work →</Link></article><article><Building2/><p className="eyebrow">Our clients</p><h2>Support that fits your operation</h2><p>We support recognised businesses and can arrange white-label or ghost-driver representation. Client brands are only displayed with permission and supplied artwork.</p><Link to="/our-services">Explore white-label support →</Link></article></div></section>

    <section className="section map-section"><div className="container-page"><SectionHeading eyebrow="Service area" title="Routes that connect business across Australia" intro="Local and regional coverage anchored by interstate capability across Australia’s major freight corridors."/><RouteMap/></div></section>

    <section className="section why-section"><div className="container-page"><SectionHeading eyebrow="Why 1st Class Express" title="The details that make delivery feel simpler" align="center"/><div className="trust-grid">{trust.map(({title,text,icon:Icon})=><article key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div><blockquote>“Let us do what we do best, to free up your time for you to do what you do best.”</blockquote></div></section>
    <CallToAction/>
    <section className="section contact-preview"><div className="container-page contact-grid"><div><SectionHeading eyebrow="Start a conversation" title="Tell us where it needs to go" intro="Share the delivery details and our team will help assess the right transport approach."/><div className="contact-person"><span>D / D</span><div><strong>{company.contactName}</strong><small>{company.contactRole}</small></div></div><a href={phoneHref(company.phonePrimary)}>{company.phonePrimary}</a><p>Fleet Operations and Customer Support</p><a href={`mailto:${company.email}`}>{company.email}</a></div><ContactForm compact/></div></section>
  </>
}
