import { BarChart3, CheckCircle2, MessageSquareText, Route, ShieldCheck, Truck, UserRoundCheck, UsersRound } from 'lucide-react'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { ResponsiveImage } from '../components/common/ResponsiveImage'
import { SeoHead } from '../components/common/SeoHead'
import { companyProfile } from '../data/companyProfile'
import routeSeo from '../data/routeSeo.json'

const values = [
  ['Safety First', 'Freight handling and operating decisions are planned with safety and care in mind.', ShieldCheck],
  ['Clear Communication', 'Customers are kept informed through collection, transit and final delivery.', MessageSquareText],
  ['Practical Planning', 'The service, vehicle and route are assessed against each freight movement.', Route],
  ['Professional People', 'Experienced drivers who represent our customers and our business well.', UsersRound],
] as const

export default function AboutPage() { return <>
  <SeoHead {...routeSeo.about}/>
  <PageHero eyebrow="About Us" title="Australian Owned. Freight Focused." intro={companyProfile.about.title} image="/images/replacement/fleet-lineup-depot-branded.webp"/>

  <section className="lovable-section lovable-section--soft"><div className="container-page lovable-split"><div><div className="lovable-heading"><p className="lovable-kicker">Who We Are</p><h2>A Transport Partner, Not Just A Truck</h2>{companyProfile.about.paragraphs.slice(0, 3).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><div className="company-established"><strong>{companyProfile.established}</strong><span>Australian-owned transport and logistics capability</span></div></div><div className="lovable-split__image"><ResponsiveImage src="/images/replacement/fleet-lineup-yard-branded.webp" alt="1st Class Express branded fleet at the depot" sizes="(max-width: 1024px) 100vw, 50vw"/></div></div></section>

  <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">How We Support Customers</p><h2>Built Around Freight, Drivers And Operations</h2><p>Support can scale from one movement to recurring delivery runs, dedicated drivers and fleet oversight, subject to the agreed engagement and availability.</p></div><div className="about-capability-grid">
    <article><Truck aria-hidden="true"/><h3>Freight Delivery Planned Around The Job</h3><p>{companyProfile.about.paragraphs[2]}</p><ul>{companyProfile.commitment.points.slice(0, 3).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul></article>
    <article><UserRoundCheck aria-hidden="true"/><h3>Professional Drivers Who Represent The Customer Well</h3>{companyProfile.driverSolutions.paragraphs.slice(0, 2).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</article>
    <article><BarChart3 aria-hidden="true"/><h3>Operational Oversight And Improvement</h3><p>For ongoing engagements, support may include:</p><ul>{companyProfile.operations.slice(0, 5).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul></article>
  </div></div></section>

  <section className="lovable-section"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Our Standards</p><h2>What We Hold Ourselves To</h2><p>{companyProfile.commitment.intro}</p></div><div className="lovable-feature-grid">{values.map(([title,text,Icon])=><article className="lovable-feature" key={title}><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

  <section className="lovable-section lovable-section--soft"><div className="container-page lovable-split"><div className="lovable-split__image"><ResponsiveImage src="/images/replacement/prime-mover-hero-branded.webp" alt="1st Class Express branded prime mover on an Australian highway" sizes="(max-width: 1024px) 100vw, 50vw"/></div><div><div className="lovable-heading"><p className="lovable-kicker">Flexible Support</p><h2>From A Single Delivery To Ongoing Transport Support</h2><p>{companyProfile.about.paragraphs[4]}</p></div><ul className="premium-check-list">{companyProfile.driverSolutions.support.slice(0, 8).map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul></div></div></section>
  <CallToAction title="Move your next load with confidence" text="Tell us what needs to move, where it is going and when it needs to arrive."/>
</> }
