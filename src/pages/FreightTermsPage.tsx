import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import {
  FREIGHT_TERMS_EFFECTIVE,
  FREIGHT_TERMS_VERSION,
  LEGAL_REVIEW_NOTICE,
  TERMS_SECTIONS,
} from '../features/freightTerms/content'

export default function FreightTermsPage() {
  return (
    <>
      <SeoHead {...routeSeo.freightTerms} />
      <PageHero
        eyebrow="Freight Terms"
        title="Freight Terms & Conditions"
        intro="The terms that apply to freight quotes requested through this site and the transport that follows. Version tracked and recorded against every quote."
        compact
      />

      <section className="lovable-section fq-terms-page">
        <div className="container-page">
          <p className="fq-terms-page__meta">
            Version <strong>{FREIGHT_TERMS_VERSION}</strong> · Effective {FREIGHT_TERMS_EFFECTIVE}
          </p>

          <p className="fq-terms-page__disclaimer" role="note">
            Parts of this document are still being settled with our legal advisers.
            Sections marked below describe how 1st Class Express operates in practice;
            the final contractual wording will be published before it takes effect. This
            page is not a substitute for legal advice.
          </p>

          <nav aria-label="Sections" className="fq-terms-page__toc">
            <ol>
              {TERMS_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="fq-terms-page__body">
            {TERMS_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="fq-terms-page__section">
                <h2>{section.title}</h2>
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {section.legalReviewRequired && (
                  /* LEGAL REVIEW REQUIRED — do not replace with drafted legal wording
                     until a qualified adviser has approved this section. */
                  <p className="fq-terms-page__review" role="note">
                    {LEGAL_REVIEW_NOTICE}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
