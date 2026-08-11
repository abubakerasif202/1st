import { Mail, MapPin, Phone } from 'lucide-react'
import { company, phoneHref } from '../../data/company'

export function AnnouncementBar() {
  return <div className="announcement"><div className="container-page announcement-inner">
    <span className="announcement-tagline">{company.tagline}</span>
    <a href={`mailto:${company.email}`}><Mail size={13} aria-hidden="true" /> <span>{company.email}</span></a>
    <span className="announcement-locations"><MapPin size={13} aria-hidden="true" />Australia-wide transport</span>
    <span className="announcement-phones"><a href={phoneHref(company.phonePrimary)}><Phone size={13} aria-hidden="true" /> {company.phonePrimary}</a></span>
  </div></div>
}
