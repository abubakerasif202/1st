import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { BreadcrumbSchema } from '../../lib/schema'

/**
 * `showBreadcrumb={false}` is for pages that render the richer <Breadcrumbs>
 * trail themselves — two "Breadcrumb" nav landmarks (and two BreadcrumbList
 * blocks) on one page is both an a11y and a structured-data defect.
 */
export function PageHero({ eyebrow, title, intro, image, showBreadcrumb = true }: { eyebrow: string; title: string; intro: string; image?: string; showBreadcrumb?: boolean }) {
  const reduce = useReducedMotion()
  const { pathname } = useLocation()
  return <section className="page-hero">
    {showBreadcrumb && <BreadcrumbSchema label={eyebrow} path={pathname} />}
    {image && <img className="page-hero__image" src={image} alt="" aria-hidden="true" width="1672" height="941" loading="eager" decoding="async"/>}
    <div className="page-hero__shade" aria-hidden="true" />
    <motion.div className="container-page relative z-10" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      {showBreadcrumb && <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} aria-hidden="true"/><span aria-current="page">{eyebrow}</span></nav>}
      <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="max-w-2xl text-lg text-stone-300">{intro}</p>
    </motion.div>
  </section>
}
