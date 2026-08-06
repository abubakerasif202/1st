import { Headphones, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { ContactForm } from '../components/forms/ContactForm'
import { company, phoneHref } from '../data/company'
import routeSeo from '../data/routeSeo.json'

export default function ContactPage() { return <>
  <SeoHead {...routeSeo.contact}/>
  <PageHero eyebrow="Contact" title="Let's Get Your Freight Moving" intro="Speak with our transport team about a new movement, an ongoing route or the support your operation needs." image="/images/replacement/warehouse-loading-branded.png"/>
  <section className="lovable-section lovable-section--soft"><div className="container-page contact-page-grid lovable-contact-grid"><div><div className="lovable-heading"><p className="lovable-kicker">Contact Details</p><h2>Speak With Our Team</h2><p>For urgent work, call directly. For planned freight, send through the details and we will review the movement.</p></div><div className="contact-cards"><article><Phone/><span>Primary phone</span><a href={phoneHref(company.phonePrimary)}>{company.phonePrimary}</a></article><article><Phone/><span>Alternate phone</span><a href={phoneHref(company.phoneSecondary)}>{company.phoneSecondary}</a></article><article><Mail/><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></article><article><Headphones/><span>Operations</span><strong>{company.contactName}</strong><small>{company.contactRole}</small></article><article className="wide"><MapPin/><span>Service region</span><strong>Metropolitan, regional and interstate Australia</strong></article></div></div><div className="contact-form-card"><p className="lovable-kicker">Online Enquiry</p><h2>Send Us The Details</h2><ContactForm/></div></div></section>
</> }
