import { PageHero } from '../components/common/PageHero'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { CustomerApplicationForm } from '../features/customerApplication/CustomerApplicationForm'

export default function CustomerApplicationPage() {
  return (
    <>
      <SeoHead {...routeSeo.customerApplication} />
      <PageHero
        compact
        eyebrow="Customer Application"
        title="Open an Account With 1st Class Express"
        intro="Tell us about your business, sites and contacts. Payment terms are requested here and confirmed separately — an account is not open until we approve it in writing."
      />
      <section className="lovable-section lovable-section--soft">
        <div className="container-page">
          <CustomerApplicationForm />
        </div>
      </section>
    </>
  )
}
