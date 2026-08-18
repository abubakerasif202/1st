import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FleetExplorer } from '../components/sections/FleetExplorer'
import { PageHero } from '../components/common/PageHero'
import { QUOTE_CTA } from '../lib/cta'
import { ResponsiveImage } from '../components/common/ResponsiveImage'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'

export default function FleetPage() { return <>
  <SeoHead {...routeSeo.fleet}/>
  <PageHero eyebrow="Our Fleet" title="The Right Vehicle For The Freight" intro="From one-tonne vans to B-double configurations, final vehicle selection is matched to the load, access, timing and route." image="/images/replacement/complete-fleet-lineup-branded.webp" cta={QUOTE_CTA}/>
  <section className="lovable-section lovable-section--dark"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Vehicle Options</p><h2>Fleet Capability</h2><p>Availability and configuration are confirmed for each booking.</p></div><FleetExplorer/></div></section>
  <section className="lovable-section lovable-section--soft"><div className="container-page"><div className="lovable-heading"><p className="lovable-kicker">Fleet Gallery</p><h2>On The Road And In The Yard</h2><p>Different parts of the transport operation, from local delivery vehicles and freight loading through to interstate linehaul.</p></div><div className="fleet-gallery">{[
    ['/images/replacement/prime-mover-hero-branded.webp', '1st Class Express branded prime mover on the highway'],
    ['/images/replacement/warehouse-loading-branded.webp', '1st Class Express branded freight loading operation'],
    ['/images/replacement/complete-fleet-lineup-branded.webp', '1st Class Express branded fleet lineup'],
    ['/images/replacement/delivery-fleet-sydney-branded.webp', '1st Class Express branded delivery fleet in Sydney'],
    ['/images/replacement/prime-mover-sunset-branded.webp', '1st Class Express branded prime mover at sunset'],
    ['/images/replacement/warehouse-dock-branded.webp', '1st Class Express branded freight operation at the loading dock'],
  ].map(([src, alt]) => <ResponsiveImage key={src} src={src} alt={alt} sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"/>)}</div><p className="qualification-note"><CheckCircle2 aria-hidden="true"/>Vehicle type, configuration and capacity are confirmed after the freight details are assessed.</p></div></section>
  <section className="lovable-final-cta"><div className="container-page"><p className="lovable-kicker">Match The Vehicle</p><h2>Tell Us What You Need To Move</h2><p>We will review the freight and confirm the most suitable available transport configuration.</p><div className="lovable-actions"><Link className="lovable-btn lovable-btn--primary" to="/quote">Get a Fleet Quote</Link></div></div></section>
</> }
