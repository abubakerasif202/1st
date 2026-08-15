import { useEffect } from 'react'
import { Printer } from 'lucide-react'
import { SeoHead } from '../components/common/SeoHead'
import fonts from '../data/fonts.json'
import { company, phoneHref } from '../data/company'
import { companyProfile } from '../data/companyProfile'
import { fleet } from '../data/fleet'
import { driverRequirements, handbook } from '../data/handbook'
import { driverRoles } from '../data/roles'
import routeSeo from '../data/routeSeo.json'
import { services } from '../data/services'

const sectionNumber = (index: number) => String(index + 1).padStart(2, '0')
const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function SectionHeading({ index }: { index: number }) {
  const title = handbook.contents[index]
  return <h2 id={slug(title)}><span>{sectionNumber(index)}</span>{title}</h2>
}

// Hanken Grotesk and Playfair Display are used by this page and nothing else,
// so they are not in index.html — every other route would have paid for seven
// font files it never renders. The prerenderer writes the same <link> into this
// route's static document, so the print faces are there before hydration and
// the page does not reflow; this effect only covers client-side navigation.
function useHandbookFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${fonts.handbook}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fonts.handbook
    document.head.appendChild(link)
  }, [])
}

// The handbook is an A4 document first and a web page second. The body class
// lets the print stylesheet strip the site chrome without touching how any
// other route prints.
function usePrintChrome() {
  useEffect(() => {
    document.body.classList.add('handbook-printing')
    return () => document.body.classList.remove('handbook-printing')
  }, [])
}

export default function DriverHandbookPage() {
  useHandbookFonts()
  usePrintChrome()
  const [firstHalf, secondHalf] = [handbook.contents.slice(0, 6), handbook.contents.slice(6)]

  return <div className="hb-stage">
    <SeoHead {...routeSeo.driverHandbook} />

    <div className="hb-toolbar">
      <p>Driver Handbook — print or save as PDF</p>
      <button type="button" className="hb-print" onClick={() => window.print()}><Printer aria-hidden="true" size={16} />Print handbook</button>
    </div>

    <article className="hb-doc" aria-label="Driver Handbook document">
      <header className="hb-cover hb-keep">
        <div>
          <p className="hb-cover__eyebrow">{handbook.eyebrow}</p>
          <h1>{handbook.title}</h1>
          <p className="hb-cover__intro">{handbook.intro}</p>
          <div className="hb-cover__badges">{handbook.badges.map(badge => <span key={badge}>{badge}</span>)}</div>
        </div>
        <img src="/brand/first-class-express-logo.webp" alt="1st Class Express" width={108} height={116} />
      </header>

      <nav className="hb-contents hb-keep" aria-label="Handbook contents">
        <div>
          <p className="hb-contents__label">Contents</p>
          <ol>{firstHalf.map(title => <li key={title}><a href={`#${slug(title)}`}>{title}</a></li>)}</ol>
        </div>
        <div>
          <p className="hb-contents__label hb-contents__label--spacer" aria-hidden="true">&nbsp;</p>
          <ol start={7}>{secondHalf.map(title => <li key={title}><a href={`#${slug(title)}`}>{title}</a></li>)}</ol>
        </div>
      </nav>

      <hr className="hb-rule" />

      <section className="hb-section">
        <SectionHeading index={0} />
        {companyProfile.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className="hb-quote hb-keep">
          <strong>{company.tagline}</strong>
          <p>{handbook.pullQuote}</p>
        </div>
      </section>

      <section className="hb-section">
        <SectionHeading index={1} />
        <p>{companyProfile.commitment.intro} {handbook.commitmentLead}</p>
        <ul className="hb-cells hb-cells--2 hb-cells--bullets">
          {companyProfile.commitment.points.map((point, index) =>
            <li key={point} className={index === companyProfile.commitment.points.length - 1 ? 'hb-cells__wide' : undefined}>{point}</li>)}
        </ul>
      </section>

      <section className="hb-section">
        <SectionHeading index={2} />
        <p>{companyProfile.driverSolutions.paragraphs[0]}</p>
        <p>{companyProfile.driverSolutions.paragraphs[1]} {handbook.standardsLead}</p>
        <div className="hb-standards">
          <ol>{companyProfile.driverSolutions.standards.slice(0, 6).map((item, index) =>
            <li key={item}><span>{sectionNumber(index)}</span>{item}</li>)}</ol>
          <ol start={7}>{companyProfile.driverSolutions.standards.slice(6).map((item, index) =>
            <li key={item}><span>{sectionNumber(index + 6)}</span>{item}</li>)}</ol>
        </div>
      </section>

      <section className="hb-section">
        <SectionHeading index={3} />
        <p>{handbook.requirementsLead}</p>
        <ul className="hb-cells hb-cells--3 hb-cells--cream" style={{ marginBottom: 16 }}>
          {driverRequirements.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p className="hb-note">{handbook.verificationNote}</p>
      </section>

      <section className="hb-section">
        <SectionHeading index={4} />
        <p>{handbook.rolesLead}</p>
        {driverRoles.map(role => <div className="hb-role hb-keep" key={role.id}>
          <div className="hb-role__head">
            <h3>{role.title}</h3>
            <span className="hb-role__code">{role.licenceCode}</span>
          </div>
          <div className="hb-role__body">
            <dl>
              <dt>Type &amp; base</dt>
              <dd>{role.employmentType} — {role.location}</dd>
              <dt>Experience</dt>
              <dd>{role.experience}</dd>
            </dl>
            <div>
              <p className="hb-role__label">Responsibilities</p>
              <ul>{role.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>)}
      </section>

      <section className="hb-section">
        <SectionHeading index={5} />
        <p>{handbook.fleetLead}</p>
        {/* Scroll container: the four-column table cannot compress below ~420px.
            role/tabIndex make the scrollable area reachable by keyboard. */}
        <div className="hb-table-scroll" role="region" aria-label="Fleet vehicles" tabIndex={0}>
        <table className="hb-table">
          <thead>
            <tr><th scope="col">Vehicle</th><th scope="col">Use</th><th scope="col">Best for</th><th scope="col">Capability</th></tr>
          </thead>
          <tbody>
            {fleet.map(vehicle => <tr key={vehicle.title}>
              <th scope="row">{vehicle.title}</th>
              <td>{vehicle.use}</td>
              <td>{vehicle.bestFor}</td>
              <td>{vehicle.capability}</td>
            </tr>)}
          </tbody>
        </table>
        </div>
      </section>

      <section className="hb-section">
        <SectionHeading index={6} />
        <div className="hb-services">
          {services.map(service => <article className={`hb-keep${service.id === 'dangerous-goods' ? ' is-flagged' : ''}`} key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.short} {service.detail}</p>
          </article>)}
        </div>
        <p className="hb-note">{handbook.servicesNote}</p>
      </section>

      <section className="hb-section">
        <SectionHeading index={7} />
        <p className="hb-chips-label">Interstate destinations</p>
        <ul className="hb-chips">{company.interstate.map(city => <li key={city}>{city}</li>)}</ul>
        <p className="hb-chips-label">Service areas</p>
        <ul className="hb-chips hb-chips--outline">{company.serviceAreas.map(area => <li key={area}>{area}</li>)}</ul>
      </section>

      <section className="hb-section">
        <SectionHeading index={8} />
        <p>{handbook.supportLead}</p>
        <ul className="hb-support">{companyProfile.driverSolutions.support.map(item => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="hb-section">
        <SectionHeading index={9} />
        <p>{handbook.performanceLead}</p>
        <ul className="hb-cells hb-cells--2 hb-cells--cream" style={{ marginBottom: 22 }}>
          {companyProfile.operations.map(item => <li key={item}>{item}</li>)}
        </ul>
        <div className="hb-callout hb-keep">
          <p>A note on safety</p>
          <p>{handbook.safetyNote}</p>
        </div>
      </section>

      <section className="hb-section">
        <SectionHeading index={10} />
        <dl className="hb-contact hb-keep">
          <div>
            <dt>{company.contactRole}</dt>
            <dd className="hb-contact__name">{company.contactName}</dd>
            <dt>Phone</dt>
            <dd className="hb-contact__phone"><a href={phoneHref(company.phonePrimary)}>{company.phonePrimary}</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd className="hb-contact__email"><a href={`mailto:${company.email}`}>{company.email}</a></dd>
            <dt>Company</dt>
            <dd className="hb-contact__about">1st Class Express Pty Ltd — {company.ownership}, {companyProfile.established.toLowerCase()}. Serving {company.cities.slice(0, -1).join(', ')} and {company.cities[company.cities.length - 1]}.</dd>
          </div>
        </dl>
      </section>

      <section className="hb-section hb-ack">
        <SectionHeading index={11} />
        <p style={{ marginBottom: 20 }}>{handbook.acknowledgement}</p>
        <div className="hb-ack__fields">
          {handbook.acknowledgementFields.map(field => <div className="hb-ack__field" key={field}>
            <i aria-hidden="true" />
            <span>{field}</span>
          </div>)}
        </div>
        <p className="hb-ack__note">{handbook.acknowledgementNote}</p>
      </section>

      <footer className="hb-footer">
        <span>{handbook.footerNote}</span>
        <span>{company.tagline}</span>
      </footer>
    </article>
  </div>
}
