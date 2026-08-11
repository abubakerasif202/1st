import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { JsonLd } from '../../lib/schema'

const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.1stclassexpress.com.au'

export interface BreadcrumbItem {
  label: string
  /** Omit on the final crumb — the current page is not a link. */
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

/**
 * The visible breadcrumb trail and its BreadcrumbList JSON-LD, emitted together
 * so the markup and the structured data can never disagree. Pages that render
 * this must pass `showBreadcrumb={false}` to PageHero, otherwise the page ends
 * up with two competing "Breadcrumb" navigation landmarks.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const trail = [{ label: 'Home', path: '/' }, ...items]
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          ...(item.path ? { item: `${siteUrl}${item.path}` } : {}),
        })),
      }} />
      <nav aria-label="Breadcrumb" className="breadcrumb-nav text-xs sm:text-sm text-slate-400 py-3 bg-slate-950/60 border-b border-slate-800/80">
        <div className="container-page flex items-center flex-wrap gap-1.5">
          <Link to="/" className="breadcrumb-nav__link inline-flex items-center gap-1 hover:text-amber-400 transition-colors">
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
          {items.map((item) => (
            <span key={`${item.label}-${item.path ?? 'current'}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" aria-hidden="true" />
              {item.path ? (
                <Link to={item.path} className="breadcrumb-nav__link hover:text-amber-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-200 font-medium" aria-current="page">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </nav>
    </>
  )
}
