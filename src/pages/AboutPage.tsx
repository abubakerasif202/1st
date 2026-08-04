import { MessageSquareText, ShieldCheck, Truck, UsersRound } from 'lucide-react'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import { RouteMap } from '../components/sections/RouteMap'

export default function AboutPage() { return <>
  <SeoHead path="/about-us" title="About 1st Class Express | Australian Freight Team" description="Meet the Australian privately owned team providing local, linehaul and interstate freight support across Australia."/>
  <PageHero eyebrow="About Us" title="Transport experience, delivered personally" intro="An Australian privately owned company helping businesses move freight with clarity, care and practical logistics support."/>
  <section className="section"><div className="container-page story-grid"><div><SectionHeading eyebrow="Our story" title="Built around the needs of working businesses"/><p>1st Class Express is backed by industry professionals with recognised transport and logistics experience across the Asia-Pacific region. The team supports local, linehaul and interstate work throughout Australia.</p><p>Our role is straightforward: understand the freight, communicate clearly and coordinate the right service for the job without making unsupported promises.</p></div><div className="statement-card"><img src="/brand/first-class-express-logo.png" alt="1st Class Express"/><strong>Australian privately owned</strong><p>Local accountability with Australia-wide capability.</p></div></div></section>
  <section className="section principles"><div className="container-page"><SectionHeading eyebrow="How we work" title="Professional principles at every handover"/><div className="principle-grid">{[[ShieldCheck,'Safety & care','Goods care and safe operating decisions stay central to the job.'],[MessageSquareText,'Communication','Clear updates help customers plan around every movement.'],[Truck,'Practical logistics','The service is matched to the freight, route and timing required.'],[UsersRound,'Customer representation','White-label driver support can be arranged to protect your customer experience.']].map(([Icon,title,text])=>{const I=Icon as typeof Truck; return <article key={String(title)}><I/><h3>{String(title)}</h3><p>{String(text)}</p></article>})}</div></div></section>
  <section className="section map-section"><div className="container-page"><SectionHeading eyebrow="Coverage" title="Metro, regional and interstate support"/><RouteMap/></div></section><CallToAction title="Move freight with a team that listens" text="Tell us what you are moving, where it is going and when it needs to arrive."/>
  </> }
