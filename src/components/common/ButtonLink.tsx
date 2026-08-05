import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = { to: string; children: React.ReactNode; variant?: 'primary' | 'secondary'; className?: string; ariaLabel?: string }
export function ButtonLink({ to, children, variant = 'primary', className = '', ariaLabel }: Props) {
  const style = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  const external = to.startsWith('tel:') || to.startsWith('mailto:')
  const content = <>{children}<ArrowRight size={17} aria-hidden="true" /></>
  return external ? <a className={`${style} ${className}`} href={to} aria-label={ariaLabel}>{content}</a> : <Link className={`${style} ${className}`} to={to} aria-label={ariaLabel}>{content}</Link>
}
