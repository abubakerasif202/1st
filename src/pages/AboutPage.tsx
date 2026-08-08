import { MessageSquareText, Route, ShieldCheck, Truck, UsersRound } from 'lucide-react'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'

const values = [
  ['Safety First', 'Freight handling and operating decisions are planned with safety and care in mind.', ShieldCheck],
  ['Clear Communication', 'Customers are kept informed through collection, transit and final delivery.', MessageSquareText],
  ['Practical Planning', 'The service, vehicle and route are assessed against each freight movement.', Route],
  ['Professional People', 'Experienced drivers who represent our customers and our business well.', UsersRound],
] as const

export default function AboutPage() { return <>
  <SeoHead {...routeSeo.about}/>
  <PageHero eyebrow="About Us" title="Australian Owned. Freight Focused." intro="We combine practical transport planning, experienced people and responsive communication to move freight properly." image="/images/replacement/warehouse-loading-branded.webp"/>
  <section className="lovable-section lovable-section--soft"><div className="container-page lovable-split"><div><div className="lovable-heading"><p className="lovable-kicker">Who We Are</p><h2>A Transport Partner, Not Just A Truck</h2><p>1st Class Express is an Australian privately owned transport company supporting metropolitan, regional and interstate freight. We coordinate the vehicle, driver, timing and route around the actual job.</p><p>Our customers work directly with a responsive operations team that understands how important reliable collection, communication and delivery are to their business.</p></div></div><div className="lovable-split__image"><img src="/images/replacement/warehouse-loading-branded.webp" alt="1st Class Express branded freight loading operation" loading="lazy"/></div></div></section>
  <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Our Standards</p><h2>What We Hold Ourselves To</h2></div><div className="lovable-feature-grid">{values.map(([title,text,Icon])=><article className="lovable-feature" key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
  <section className="lovable-section"><div className="container-page lovable-split"><div className="lovable-split__image"><img src="/images/replacement/prime-mover-hero-branded.webp" alt="1st Class Express branded prime mover on an Australian highway" loading="lazy"/></div><div><div className="lovable-heading"><p className="lovable-kicker">Why Customers Stay</p><h2>Reliable By Design</h2><p>Professional drivers, flexible scheduling, useful communication and transport solutions shaped around the job—not a one-size-fits-all template.</p></div><div className="lovable-proof"><Truck/><strong>Metropolitan to interstate</strong><span>Vans through to B-double configurations</span></div></div></div></section>
  <CallToAction title="Move your next load with confidence" text="Tell us what needs to move, where it is going and when it needs to arrive."/>
</> }
