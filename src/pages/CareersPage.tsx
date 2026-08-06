import { CheckCircle2, HeartHandshake, ShieldCheck, TrendingUp, Truck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { ApplicationForm } from '../components/forms/ApplicationForm'
import { RoleCard } from '../components/sections/RoleCard'
import { driverRoles } from '../data/roles'
import routeSeo from '../data/routeSeo.json'

const whyWorkWithUs = [
  ['Professional fleet', 'Work with a well-presented, professionally branded fleet.', Truck],
  ['Local and interstate opportunities', 'Roles span Sydney metropolitan delivery through to interstate linehaul routes.', TrendingUp],
  ['Safety-focused environment', 'Operations follow fatigue-management, WHS and safe-driving procedures.', ShieldCheck],
  ['Reliable operations', 'Established scheduling and dispatch support helps drivers plan their work.', CheckCircle2],
  ['Supportive transport team', 'An experienced team that values clear communication and professional conduct.', UsersRound],
  ['Long-term opportunities', 'Ongoing and dedicated placements are available by agreement and availability.', HeartHandshake],
] as const

const driverRequirements = [
  'Valid Australian driver licence',
  'The correct licence class for the role applied for',
  'Relevant heavy-vehicle driving experience, where required by the role',
  'A safe driving history',
  'Strong verbal and written communication skills',
  'Reliability and punctuality',
  'Ability to complete required transport and freight documentation',
  'Legal right to work in Australia',
  'Willingness to follow fatigue-management, safety and company procedures',
] as const

// JobPosting structured data is only emitted for roles genuinely marked "open" in
// src/data/roles.ts — expressions of interest and closed roles never get schema.
function JobPostingSchema() {
  const openRoles = driverRoles.filter(role => role.status === 'open')
  if (!openRoles.length) return null
  return <>{openRoles.map(role => <script key={role.id} type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: role.title,
      description: `${role.experience}. Responsibilities include: ${role.responsibilities.join(', ')}.`,
      employmentType: role.employmentType,
      hiringOrganization: { '@type': 'Organization', name: '1st Class Express', sameAs: 'https://www.1stclassexpress.com.au' },
      jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: role.location, addressCountry: 'AU' } },
      datePosted: new Date().toISOString().slice(0, 10),
    }),
  }} />)}</>
}

export default function CareersPage() {
  return <>
    <SeoHead {...routeSeo.careers} />
    <JobPostingSchema />
    <PageHero eyebrow="Careers" title="Drive Your Career Forward" intro="Join a professional Australian transport team, with local and interstate driving opportunities for experienced, reliable drivers." image="/images/replacement/prime-mover-hero-branded.png" />

    <section className="lovable-section lovable-section--soft">
      <div className="container-page">
        <div className="lovable-heading"><p className="lovable-kicker">Why Drive With Us</p><h2>A Professional Team Built Around Safety And Reliability</h2><p>1st Class Express offers driving opportunities across local Sydney delivery and interstate linehaul routes.</p></div>
        <div className="lovable-feature-grid">{whyWorkWithUs.map(([title, text, Icon]) => <article className="lovable-feature" key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section id="roles" className="lovable-section lovable-section--dark">
      <div className="container-page">
        <div className="lovable-heading"><p className="lovable-kicker">Available Driver Roles</p><h2>Current Driving Opportunities</h2><p>Roles are shown as open, expressions of interest, or currently closed. Registering interest does not guarantee an offer of work.</p></div>
        <div className="role-card-grid">{driverRoles.map(role => <RoleCard key={role.id} role={role} />)}</div>
      </div>
    </section>

    <section className="lovable-section lovable-section--soft">
      <div className="container-page">
        <div className="lovable-heading"><p className="lovable-kicker">Driver Requirements</p><h2>What We Generally Look For</h2><p>Requirements vary by role. The items below are common expectations rather than a guarantee that every item applies to every position.</p></div>
        <ul className="content-list-grid">{driverRequirements.map(item => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}</ul>
      </div>
    </section>

    <section id="apply" className="lovable-section lovable-section--dark">
      <div className="container-page form-layout">
        <div>
          <p className="lovable-kicker">Driver Application</p>
          <h2>Apply Or Register Your Interest</h2>
          <p>Complete the form with your details, driving experience and a current résumé. Fields marked with an asterisk are required.</p>
          <p className="privacy-notice"><strong>Privacy notice.</strong> Information submitted through this form is used to assess your application for driving roles with 1st Class Express. Shortlisted applicants may be contacted using the details provided. Applicant information is not published, and is not retained for longer than necessary for recruitment purposes.</p>
        </div>
        <ApplicationForm />
      </div>
    </section>

    <section className="lovable-final-cta">
      <div className="container-page">
        <p className="lovable-kicker">Prefer To Talk First?</p>
        <h2>Have A Question About A Driving Role?</h2>
        <p>Contact the team directly and we will point you to the right opportunity.</p>
        <div className="lovable-actions"><Link className="lovable-btn lovable-btn--secondary" to="/contact">Contact the Team</Link></div>
      </div>
    </section>
  </>
}
