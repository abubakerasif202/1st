import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company, phoneHref } from '../../data/company'

export function SiteFooter() {
  return <footer className="site-footer"><div className="container-page footer-grid">
    <div><img src="/brand/first-class-express-logo.png" loading="lazy" alt="1st Class Express" width="170" height="185" /><p>Local, linehaul and interstate transport support delivered with care, communication and practical experience.</p></div>
    <div><h2>Navigate</h2><Link to="/about-us">About Us</Link><Link to="/our-services">Our Services</Link><Link to="/our-fleet">Our Fleet</Link><Link to="/book-now">Get a Quote</Link></div>
    <div><h2>Contact</h2><a href={phoneHref(company.phonePrimary)}><Phone size={16} />{company.phonePrimary}</a><a href={phoneHref(company.phoneSecondary)}><Phone size={16} />{company.phoneSecondary}</a><a href={`mailto:${company.email}`}><Mail size={16} />{company.email}</a><span><MapPin size={16} />Australia-wide service</span></div>
  </div><div className="container-page footer-bottom"><span>© {new Date().getFullYear()} 1st Class Express. All rights reserved.</span><span>{company.tagline}</span></div></footer>
}
