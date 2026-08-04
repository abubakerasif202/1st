import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  const reduce = useReducedMotion()
  return <section className="page-hero">
    <div className="route-lines" aria-hidden="true" />
    <motion.div className="container-page relative z-10" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={14} /><span>{eyebrow}</span></nav>
      <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="max-w-2xl text-lg text-stone-300">{intro}</p>
    </motion.div>
  </section>
}
