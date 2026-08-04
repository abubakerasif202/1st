import { Mail, MapPin, Phone } from 'lucide-react'
import { company, phoneHref } from '../../data/company'

export function AnnouncementBar() {
  return <div className="announcement"><div className="container-page announcement-inner">
    <a href={`mailto:${company.email}`}><Mail size={13} /> <span>{company.email}</span></a>
    <span className="announcement-locations"><MapPin size={13} />{company.cities.join(' • ')}</span>
    <a href={phoneHref(company.phonePrimary)}><Phone size={13} /> {company.phonePrimary}</a>
  </div></div>
}
