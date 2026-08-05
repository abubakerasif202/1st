import { BarChart3, CheckCircle2, UsersRound } from 'lucide-react'
import { ButtonLink } from '../components/common/ButtonLink'
import { CallToAction } from '../components/common/CallToAction'
import { PageHero } from '../components/common/PageHero'
import { SectionHeading } from '../components/common/SectionHeading'
import { SeoHead } from '../components/common/SeoHead'
import { companyProfile } from '../data/companyProfile'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

export default function ServicesPage() { return <>
  <SeoHead {...routeSeo.services}/><PageHero eyebrow="Our Services" title="Freight, drivers and fleet support shaped around the job" intro="Professional delivery, dedicated driver and managed fleet services for Sydney metropolitan, regional and interstate operations."/>
  <section className="section"><div className="container-page detailed-services"><SectionHeading eyebrow="Transport services" title="Delivery support for the freight, route and timing required" intro="Services can be planned for parcels and cartons, pallets and bulk freight, fragile items, dangerous goods and dedicated business delivery runs."/>{services.map(({title,detail,short,icon:Icon},i)=><article key={title}><div className="service-number">0{i+1}</div><div className="service-symbol"><Icon aria-hidden="true"/></div><div><h2>{title}</h2><p>{short}</p><p className="operational-note"><strong>How it works:</strong> {detail} Share the freight details, pickup, destination and preferred timing so the request can be assessed.</p></div><ButtonLink to="/book-now" variant="secondary" ariaLabel={`Request a quote for ${title}`}>Request a quote</ButtonLink></article>)}</div></section>
  <section className="section people-section"><div className="container-page"><SectionHeading eyebrow="Professional driver solutions" title={companyProfile.driverSolutions.title} intro={companyProfile.driverSolutions.paragraphs[0]}/><div className="content-columns"><div>{companyProfile.driverSolutions.paragraphs.slice(1).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><ul className="content-list-grid content-list-grid--light">{companyProfile.driverSolutions.support.map(item=><li key={item}><UsersRound aria-hidden="true"/>{item}</li>)}</ul></div></div></section>
  <section className="section services-section"><div className="container-page"><SectionHeading eyebrow="Performance and operational support" title="A delivery operation built for review and continuity" intro="Support can extend beyond the run itself, helping customers plan resources, coverage and continuous improvement."/><ul className="content-list-grid">{companyProfile.operations.map(item=><li key={item}><BarChart3 aria-hidden="true"/>{item}</li>)}</ul></div></section>
  <section className="section"><div className="container-page"><SectionHeading eyebrow="Driver standards" title="Business-ready people on customer-facing runs"/><ul className="content-list-grid content-list-grid--light">{companyProfile.driverSolutions.standards.map(item=><li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul></div></section><CallToAction title="Plan your next delivery run" text="Share the freight, route and operating requirements so our team can assess the right support."/>
</> }
