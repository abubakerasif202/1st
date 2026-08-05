import { Mail, MapPin, Phone } from 'lucide-react'
import { company, phoneHref } from '../../data/company'

export function AnnouncementBar() {
  return <div className="announcement"><div className="container-page announcement-inner">
    <span className="announcement-tagline">Committed to Delivering a Quality Service</span>
    <a href={`mailto:${company.email}`}><Mail size={13} /> <span>{company.email}</span></a>
    <span className="announcement-locations"><MapPin size={13} />Australia-wide transport</span>
    <span className="announcement-phones"><a href={phoneHref(company.phonePrimary)}><Phone size={13} /> {company.phonePrimary}</a><a href={phoneHref(company.phoneSecondary)}>{company.phoneSecondary}</a></span>
  </div></div>
}
