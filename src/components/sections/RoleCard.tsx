import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DriverRole } from '../../data/roles'

const statusLabel: Record<DriverRole['status'], string> = { open: 'Now hiring', eoi: 'Expressions of interest', closed: 'Currently closed' }

export function RoleCard({ role }: { role: DriverRole }) {
  return <article className={`role-card role-card--${role.status}`}>
    <div className="role-card__status"><span>{statusLabel[role.status]}</span></div>
    <h3>{role.title}</h3>
    <dl>
      <div><dt>Employment type</dt><dd>{role.employmentType}</dd></div>
      <div><dt>Operating area</dt><dd>{role.location}</dd></div>
      <div><dt>Licence class</dt><dd>{role.licenceClass}</dd></div>
      <div><dt>Experience</dt><dd>{role.experience}</dd></div>
    </dl>
    <ul className="role-card__responsibilities">{role.responsibilities.map(item => <li key={item}><CheckCircle2 aria-hidden="true" size={15} />{item}</li>)}</ul>
    {role.status === 'closed'
      ? <p className="role-card__closed-note">Not currently accepting applications for this role.</p>
      : <Link className="btn-secondary" to={`/careers?role=${encodeURIComponent(role.title)}#apply`} aria-label={`${role.status === 'open' ? 'Apply for' : 'Register interest for'} ${role.title}`}>{role.status === 'open' ? 'Apply Now' : 'Register Interest'}</Link>}
  </article>
}
