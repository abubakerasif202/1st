import { CheckCircle2, Mail, Phone } from 'lucide-react'
import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import { company, phoneHref } from '../data/company'
import routeSeo from '../data/routeSeo.json'
import { QuoteWizard } from '../features/freightQuote/QuoteWizard'

export default function BookNowPage() {
  return (
    <>
      <SeoHead {...routeSeo.book} />
      <PageHero
        compact
        eyebrow="Request A Quote"
        title="Tell Us What Needs Moving"
        intro="Work through the freight, route, timing and handling details. Our operations team reviews the job and responds with a priced quote."
        image="/images/replacement/warehouse-loading-branded.webp"
      />
      <section className="lovable-section lovable-section--soft">
        <div className="container-page form-layout lovable-form-layout">
          <div>
            <div className="lovable-heading">
              <p className="lovable-kicker">Your Freight Details</p>
              <h2>Request A Transport Quote</h2>
              <p>The more detail you provide, the faster we can assess the right vehicle, timing and route.</p>
            </div>
            <QuoteWizard />
          </div>
          <aside className="quote-side">
            <p className="lovable-kicker">What Happens Next</p>
            <h2>Three Steps From Enquiry To Delivery</h2>
            <ol>
              <li>
                <b>01</b>
                <span>
                  <strong>We review your request</strong>Freight, route, access and timing are assessed.
                </span>
              </li>
              <li>
                <b>02</b>
                <span>
                  <strong>We confirm the requirements</strong>Vehicle and transport details are agreed with you.
                </span>
              </li>
              <li>
                <b>03</b>
                <span>
                  <strong>We coordinate the movement</strong>Pickup and delivery are scheduled and communicated.
                </span>
              </li>
            </ol>
            <h3>Prefer To Talk It Through?</h3>
            <a href={phoneHref(company.phonePrimary)}>
              <Phone aria-hidden="true" />
              {company.phonePrimary}
            </a>
            <a href={`mailto:${company.email}`}>
              <Mail aria-hidden="true" />
              {company.email}
            </a>
            <p className="quote-note">
              <CheckCircle2 aria-hidden="true" />
              No obligation. Freight acceptance is subject to assessment and availability.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
