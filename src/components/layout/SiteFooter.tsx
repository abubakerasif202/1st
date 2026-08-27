import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company, phoneHref } from '../../data/company'
import { services } from '../../data/services'
import { ABDeveloperCredit } from './ABDeveloperCredit'

export function SiteFooter() {
  return <footer className="site-footer"><div className="container-page footer-grid">
    <div className="footer-brand"><img src="/brand/first-class-express-logo.webp" loading="lazy" alt="1st Class Express" width="170" height="185"/><p>{company.tagline}. Australian privately owned transport, linehaul and logistics.</p><p><MapPin size={16} aria-hidden="true"/>Servicing NSW, ACT and interstate routes</p></div>
    <div><h3>Explore</h3><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/services">Services</Link><Link to="/fleet">Our Fleet</Link><Link to="/service-areas">Service Areas</Link><Link to="/careers">Careers</Link><Link to="/driver-handbook">Driver Handbook</Link><Link to="/contact">Contact</Link><Link to="/quote">Request a Quote</Link></div>
    <div><h3>Services</h3>{services.slice(0,6).map(service=><Link key={service.id} to={`/services#${service.id}`}>{service.title}</Link>)}</div>
    <div><h3>Contact</h3><a href={phoneHref(company.phonePrimary)}><Phone size={16} aria-hidden="true"/>{company.phonePrimary}</a><a href={`mailto:${company.email}`}><Mail size={16} aria-hidden="true"/>{company.email}</a><span><MapPin size={16} aria-hidden="true"/>Australia-wide service</span></div>
  </div><div className="container-page footer-bottom"><span>© {new Date().getFullYear()} 1st Class Express. All rights reserved.</span><span>Dangerous goods transport is subject to freight details, compliance requirements and written confirmation.</span></div><ABDeveloperCredit /></footer>
}
