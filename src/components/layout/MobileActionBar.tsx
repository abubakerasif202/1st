import { Mail, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company, phoneHref } from '../../data/company'

export function MobileActionBar() { return <nav className="mobile-actions" aria-label="Quick contact"><a href={phoneHref(company.phonePrimary)}><Phone /><span>Call</span></a><a href={`mailto:${company.email}`}><Mail /><span>Email</span></a><Link to="/quote"><Send /><span>Quote</span></Link></nav> }
