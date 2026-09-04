import { useLocation } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { QuoteConfirmation } from '../features/freightQuote/QuoteConfirmation'

export default function QuoteConfirmationPage() {
  const { pathname } = useLocation()
  return (
    <section className="lovable-section fq-confirm-page">
      <SeoHead
        title="Quote Request Received | 1st Class Express"
        description="Your freight quote request has been received by 1st Class Express."
        path={pathname}
        noIndex
      />
      <div className="container-page">
        <QuoteConfirmation />
      </div>
    </section>
  )
}
