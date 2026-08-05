import { CheckCircle2, Mail, Phone } from 'lucide-react'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { QuoteForm } from '../components/forms/QuoteForm'
import { company, phoneHref } from '../data/company'
import routeSeo from '../data/routeSeo.json'

export default function BookNowPage() { return <>
  <SeoHead {...routeSeo.book}/>
  <PageHero eyebrow="Request A Quote" title="Tell Us What Needs Moving" intro="Share the freight, route and timing details. Our operations team will review the job and respond with the next step." image="/images/lovable/forklift-trailer.jpg"/>
  <section className="lovable-section lovable-section--soft"><div className="container-page form-layout lovable-form-layout"><div><div className="lovable-heading"><p className="lovable-kicker">Your Freight Details</p><h2>Request A Transport Quote</h2><p>The more detail you provide, the faster we can assess the right vehicle, timing and route.</p></div><QuoteForm/></div><aside className="quote-side"><p className="lovable-kicker">What Happens Next</p><h2>Three Steps From Enquiry To Delivery</h2><ol><li><b>01</b><span><strong>We review your request</strong>Freight, route, access and timing are assessed.</span></li><li><b>02</b><span><strong>We confirm the requirements</strong>Vehicle and transport details are agreed with you.</span></li><li><b>03</b><span><strong>We coordinate the movement</strong>Pickup and delivery are scheduled and communicated.</span></li></ol><h3>Prefer To Talk It Through?</h3><a href={phoneHref(company.phonePrimary)}><Phone/>{company.phonePrimary}</a><a href={phoneHref(company.phoneSecondary)}><Phone/>{company.phoneSecondary}</a><a href={`mailto:${company.email}`}><Mail/>{company.email}</a><p className="quote-note"><CheckCircle2/>No obligation. Freight acceptance is subject to assessment and availability.</p></aside></div></section>
</> }
