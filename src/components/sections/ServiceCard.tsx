import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ServiceCard({ title, text, icon: Icon, index }: { title: string; text: string; icon: LucideIcon; index: number }) {
  return <article className="service-card"><span className="card-index">0{index + 1}</span><Icon className="card-icon" aria-hidden="true"/><h3>{title}</h3><p>{text}</p><Link to="/our-services">Learn more <ArrowUpRight size={16}/></Link></article>
}
