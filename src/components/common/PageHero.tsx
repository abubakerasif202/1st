import { ArrowRight, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { HeroCta } from '../../lib/cta'
import { BreadcrumbSchema } from '../../lib/schema'
import { ResponsiveImage } from './ResponsiveImage'

/**
 * `showBreadcrumb={false}` is for pages that render the richer <Breadcrumbs>
 * trail themselves — two "Breadcrumb" nav landmarks (and two BreadcrumbList
 * blocks) on one page is both an a11y and a structured-data defect.
 */
interface PageHeroProps {
  eyebrow: string
  title: string
  intro: string
  image?: string
  showBreadcrumb?: boolean
  /** Optional conversion action under the intro. See src/lib/cta.ts. */
  cta?: HeroCta
  /**
   * Shorter hero for the two conversion routes. /quote and /contact exist to be
   * acted on, and a 480px hero pushed the wizard's first step and the phone
   * number out of the first viewport on a laptop.
   */
  compact?: boolean
  /** Rendered under the intro — used for Contact's urgent-contact strip. */
  children?: ReactNode
}

export function PageHero({ eyebrow, title, intro, image, showBreadcrumb = true, cta, compact = false, children }: PageHeroProps) {
  const { pathname } = useLocation()
  return <section className={`page-hero${compact ? ' page-hero--compact' : ''}`}>
    {showBreadcrumb && <BreadcrumbSchema label={eyebrow} path={pathname} />}
    {image && <ResponsiveImage className="page-hero__image" src={image} alt="" hidden sizes="100vw" priority/>}
    <div className="page-hero__shade" aria-hidden="true" />
    <div className="container-page relative z-10 page-hero__reveal">
      {showBreadcrumb && <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} aria-hidden="true"/><span aria-current="page">{eyebrow}</span></nav>}
      <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="max-w-2xl text-lg text-stone-300">{intro}</p>
      {cta && <div className="page-hero__actions"><Link className="lovable-btn lovable-btn--primary" to={cta.to}>{cta.label}<ArrowRight size={18} aria-hidden="true"/></Link></div>}
      {children}
    </div>
  </section>
}
