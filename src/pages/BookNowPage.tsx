import { Mail, Phone } from 'lucide-react'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { QuoteForm } from '../components/forms/QuoteForm'
import { company, phoneHref } from '../data/company'

export default function BookNowPage() { return <><SeoHead path="/book-now" title="Request a Freight Quote | 1st Class Express" description="Request a freight quote from 1st Class Express for local, linehaul and interstate transport across Australia."/><PageHero eyebrow="Book Now" title="Give us the freight details" intro="A clear brief helps us understand the route, timing and transport support your freight may require."/><section className="section"><div className="container-page form-layout"><div><p className="eyebrow">Quote request</p><h2>Plan your next movement</h2><p>Complete the form and keep your entries if validation needs attention. Online submission will only activate when a secure form endpoint is configured.</p><aside><strong>Prefer to speak directly?</strong><a href={phoneHref(company.phonePrimary)}><Phone/>{company.phonePrimary}</a><a href={`mailto:${company.email}`}><Mail/>{company.email}</a></aside></div><QuoteForm/></div></section></> }
