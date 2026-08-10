import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav text-xs sm:text-sm text-slate-400 py-3 bg-slate-950/60 border-b border-slate-800/80">
      <div className="container-page flex items-center flex-wrap gap-1.5">
        <Link to="/" className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-amber-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-200 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  )
}
