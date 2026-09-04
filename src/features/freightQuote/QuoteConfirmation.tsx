import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { INFRASTRUCTURE_MESSAGE, loadQuoteConfirmation, QuoteApiError } from './api'
import { formatQuoteSummary } from './clipboard'
import { DELIVERY_AUTHORITY_LABELS, FREIGHT_ITEM_TYPE_LABELS, SERVICE_PRIORITY_LABELS } from './labels'
import { recallQuoteToken } from './sessionStore'
import type { QuoteDetail } from './types'

interface RouteState {
  quote?: QuoteDetail
  token?: string
}

type LoadState =
  | { phase: 'ready'; quote: QuoteDetail }
  | { phase: 'loading' }
  | { phase: 'error'; message: string; kind: QuoteApiError['kind'] }

const NO_TOKEN_MESSAGE =
  'This confirmation link needs the secure token issued when the quote was submitted. Please use the link from your confirmation email.'

function useConfirmationQuote(): LoadState {
  const { reference = '' } = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const stateQuote = (location.state as RouteState | null)?.quote
  const tokenFromUrl = searchParams.get('token')

  const [state, setState] = useState<LoadState>(() => {
    if (stateQuote) return { phase: 'ready', quote: stateQuote }
    const token = tokenFromUrl ?? recallQuoteToken(reference)
    return token
      ? { phase: 'loading' }
      : { phase: 'error', kind: 'not_found', message: NO_TOKEN_MESSAGE }
  })

  useEffect(() => {
    if (stateQuote) return
    const token = tokenFromUrl ?? recallQuoteToken(reference)
    if (!token) return
    let cancelled = false
    loadQuoteConfirmation(reference, token)
      .then((quote) => {
        if (!cancelled) setState({ phase: 'ready', quote })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const kind = error instanceof QuoteApiError ? error.kind : 'unknown'
        const message =
          error instanceof QuoteApiError
            ? error.message
            : 'We could not load this quote right now.'
        setState({ phase: 'error', kind, message })
      })
    return () => {
      cancelled = true
    }
  }, [reference, stateQuote, tokenFromUrl])

  return state
}

function CopyButton({ quote }: { quote: QuoteDetail }) {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(async () => {
    const text = formatQuoteSummary(quote)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: a hidden textarea + execCommand for older browsers.
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2500)
      } finally {
        document.body.removeChild(area)
      }
    }
  }, [quote])

  return (
    <button type="button" className="fq-btn fq-btn--outline" onClick={onCopy}>
      {copied ? 'Copied ✓' : 'Copy details'}
    </button>
  )
}

export function QuoteConfirmation() {
  const state = useConfirmationQuote()

  if (state.phase === 'loading') {
    return (
      <div className="fq-confirm" aria-busy="true">
        <p className="fq-confirm__status" role="status">
          Loading your quote…
        </p>
      </div>
    )
  }

  if (state.phase === 'error') {
    const message = state.kind === 'infrastructure' ? INFRASTRUCTURE_MESSAGE : state.message
    return (
      <div className="fq-confirm">
        <p className="fq-banner fq-banner--error" role="alert">
          {message}
        </p>
        <Link className="fq-btn fq-btn--outline" to="/quote">
          Back to the quote form
        </Link>
      </div>
    )
  }

  const { quote } = state
  const submitted = new Date(quote.createdAt).toLocaleString('en-AU')

  return (
    <div className="fq-confirm">
      <header className="fq-confirm__head">
        <p className="fq-confirm__eyebrow">Quote request received</p>
        <h1 className="fq-confirm__ref">{quote.referenceNumber}</h1>
        <p className="fq-confirm__meta">
          Submitted {submitted}. Keep this reference — it stays with the job through
          to delivery.
        </p>
      </header>

      <div className="fq-confirm__actions fq-no-print">
        <button type="button" className="fq-btn fq-btn--primary" onClick={() => window.print()}>
          Print
        </button>
        <CopyButton quote={quote} />
        <button
          type="button"
          className="fq-btn fq-btn--outline"
          onClick={() => window.print()}
          title="Opens your browser print dialog — choose “Save as PDF”."
        >
          Download / save PDF
        </button>
        <Link className="fq-btn fq-btn--ghost" to="/">
          Back to home
        </Link>
      </div>

      <div className="fq-confirm__sheet">
        <div className="fq-confirm__grid">
          <section>
            <h2>Pickup</h2>
            <p>
              {quote.pickup.addressLine1}
              {quote.pickup.addressLine2 ? `, ${quote.pickup.addressLine2}` : ''}
              <br />
              {quote.pickup.suburb} {quote.pickup.state} {quote.pickup.postcode}
            </p>
            <p>
              {quote.pickup.contactName} · {quote.pickup.contactPhone}
              <br />
              Date {quote.pickup.pickupDate}
              {quote.pickup.readyTime ? ` · ready ${quote.pickup.readyTime}` : ''} · cutoff{' '}
              {quote.pickup.cutoffTime}
            </p>
          </section>

          <section>
            <h2>Delivery</h2>
            <p>
              {quote.delivery.addressLine1}
              {quote.delivery.addressLine2 ? `, ${quote.delivery.addressLine2}` : ''}
              <br />
              {quote.delivery.suburb} {quote.delivery.state} {quote.delivery.postcode}
            </p>
            <p>
              {quote.delivery.contactName} · {quote.delivery.contactPhone}
              <br />
              {quote.delivery.requestedDeliveryDate
                ? `Requested ${quote.delivery.requestedDeliveryDate}`
                : 'Flexible date'}{' '}
              · cutoff {quote.delivery.cutoffTime}
            </p>
          </section>

          <section>
            <h2>Service</h2>
            <p>
              {SERVICE_PRIORITY_LABELS[quote.servicePriority]}
              {quote.serviceSpecificDate ? ` — ${quote.serviceSpecificDate}` : ''}
              <br />
              {DELIVERY_AUTHORITY_LABELS[quote.deliveryAuthority]}
            </p>
            {quote.atlInstructions && <p>Leave freight: {quote.atlInstructions}</p>}
          </section>

          <section>
            <h2>Customer</h2>
            <p>
              {quote.customerCompany ? (
                <>
                  {quote.customerCompany}
                  <br />
                </>
              ) : null}
              {quote.customerName}
              <br />
              {quote.customerEmail} · {quote.customerPhone}
              {quote.customerReference ? (
                <>
                  <br />
                  Ref {quote.customerReference}
                </>
              ) : null}
            </p>
          </section>
        </div>

        <section className="fq-confirm__freight">
          <h2>Freight items</h2>
          <table className="fq-confirm__table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Type</th>
                <th scope="col">Qty</th>
                <th scope="col">L×W×H (cm)</th>
                <th scope="col">Weight each</th>
                <th scope="col">Volume</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{FREIGHT_ITEM_TYPE_LABELS[item.itemType]}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.lengthCm}×{item.widthCm}×{item.heightCm}
                  </td>
                  <td>{item.weightEachKg} kg</td>
                  <td>{item.volumeM3} m³</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Totals
                </th>
                <td>{quote.totals.totalItems}</td>
                <td />
                <td>{quote.totals.totalWeightKg} kg</td>
                <td>{quote.totals.totalVolumeM3} m³</td>
              </tr>
            </tfoot>
          </table>
        </section>

        <p className="fq-confirm__note">
          1st Class Express will review this request and send a priced quote. Figures
          above are the details you provided; chargeable weight and volume are
          confirmed with the quote.
        </p>
      </div>
    </div>
  )
}
