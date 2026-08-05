import { BadgeCheck, MessageSquareText, ShieldCheck, Truck, UsersRound } from 'lucide-react'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { companyProfile } from '../data/companyProfile'
import { RouteMap } from '../components/sections/RouteMap'

const operatingPrinciples = [
  { icon: ShieldCheck, title: 'Safety and care', text: 'Freight handling and operating decisions are planned with safety, goods care and applicable procedures in mind.' },
  { icon: MessageSquareText, title: 'Professional communication', text: 'Clear communication helps customers plan for collection, transit and final delivery.' },
  { icon: Truck, title: 'Practical transport planning', text: 'The service, vehicle and route are assessed against the freight and operational requirements.' },
  { icon: UsersRound, title: 'Customer representation', text: 'Dedicated drivers and client-approved uniforms can be arranged by agreement and availability.' },
] as const

export default function AboutPage() { return <>
  <SeoHead {...routeSeo.about}/>
  <PageHero eyebrow="About Us" title={companyProfile.about.title} intro={companyProfile.about.paragraphs[0]}/>
  <section className="section"><div className="container-page story-grid"><div><SectionHeading eyebrow="Our company" title="Established transport support for growing operations"/>{companyProfile.about.paragraphs.slice(1, 4).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><div className="statement-card"><img src="/brand/first-class-express-logo.png" loading="lazy" decoding="async" alt="1st Class Express" width="220" height="235"/><strong>{companyProfile.established}</strong><p>Australian-owned freight delivery, professional drivers and fleet-management support across Sydney and interstate routes.</p></div></div></section>
  <section className="section principles"><div className="container-page"><SectionHeading eyebrow="Our commitment" title="Carefully managed transport from collection to final delivery" intro={companyProfile.commitment.intro}/><ul className="content-list-grid content-list-grid--light">{companyProfile.commitment.points.map(item=><li key={item}><BadgeCheck aria-hidden="true"/>{item}</li>)}</ul></div></section>
  <section className="section"><div className="container-page"><SectionHeading eyebrow="Operating approach" title="Professional principles at every handover"/><div className="principle-grid">{operatingPrinciples.map(({icon: Icon,title,text})=><article key={title}><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
  <section className="section map-section"><div className="container-page"><SectionHeading eyebrow="Coverage" title="Sydney, regional and interstate support" intro={companyProfile.about.paragraphs[4]}/><RouteMap/></div></section>
  <CallToAction title="Discuss your transport requirements" text="Tell us what you are moving, where it is going and the support your operation needs."/>
</> }
