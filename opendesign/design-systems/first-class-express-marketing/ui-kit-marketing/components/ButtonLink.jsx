import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ButtonLink({ to, children, variant = 'primary', ariaLabel }) {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return <Link className={className} to={to} aria-label={ariaLabel}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>
}
