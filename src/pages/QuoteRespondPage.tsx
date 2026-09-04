import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SeoHead } from '../components/common/SeoHead'
import { QuoteApiError } from '../features/freightQuote/api'
import { loadRespondQuote, submitQuoteResponse } from '../features/freightQuote/respondApi'
import { SERVICE_PRIORITY_LABELS } from '../features/freightQuote/labels'
import type { QuoteDetail } from '../features/freightQuote/types'

type View =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'ready'; quote: QuoteDetail }
  | { phase: 'done'; quote: QuoteDetail; action: 'accept' | 'decline' }

function money(value: number | null | undefined): string {
  return value === null || value === undefined
    ? '—'
    : value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })
}

export default function QuoteRespondPage() {
  const { reference = '' } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [view, setView] = useState<View>(() =>
    token ? { phase: 'loading' } : { phase: 'error', message: 'This link is missing its secure token.' },
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    loadRespondQuote(reference, token)
      .then((quote) => !cancelled && setView({ phase: 'ready', quote }))
      .catch((error: unknown) => {
        if (cancelled) return
        setView({
          phase: 'error',
          message: error instanceof QuoteApiError ? error.message : 'Unable to load this quote.',
        })
      })
    return () => {
      cancelled = true
    }
  }, [reference, token])

  const respond = useCallback(
    async (action: 'accept' | 'decline') => {
      setBusy(true)
      try {
        const quote = await submitQuoteResponse(reference, token, action)
        setView({ phase: 'done', quote, action })
      } catch (error) {
        setView({
          phase: 'error',
          message: error instanceof QuoteApiError ? error.message : 'Unable to record your response.',
        })
      } finally {
        setBusy(false)
      }
    },
    [reference, token],
  )

  return (
    <section className="lovable-section fq-respond-page">
      <SeoHead
        title={`Respond to quote ${reference} | 1st Class Express`}
        description="Accept or decline your freight quote from 1st Class Express."
        noIndex
      />
      <div className="container-page fq-respond">
        {view.phase === 'loading' && <p role="status">Loading your quote…</p>}

        {view.phase === 'error' && (
          <>
            <h1>Quote {reference}</h1>
            <p className="fq-banner fq-banner--error" role="alert">
              {view.message}
            </p>
            <Link className="fq-btn fq-btn--outline" to="/contact">
              Contact our team
            </Link>
          </>
        )}

        {view.phase === 'ready' && (
          <>
            <h1>Quote {view.quote.referenceNumber}</h1>
            <p>
              {view.quote.pickup.suburb} {view.quote.pickup.state} →{' '}
              {view.quote.delivery.suburb} {view.quote.delivery.state} ·{' '}
              {SERVICE_PRIORITY_LABELS[view.quote.servicePriority]}
            </p>
            <dl className="fq-respond__price">
              <div>
                <dt>Quote (ex GST)</dt>
                <dd>{money(view.quote.quotedPrice)}</dd>
              </div>
              <div>
                <dt>GST</dt>
                <dd>{money(view.quote.quotedPriceGst)}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>
                  {money(
                    (view.quote.quotedPrice ?? 0) + (view.quote.quotedPriceGst ?? 0) || null,
                  )}
                </dd>
              </div>
            </dl>
            <div className="fq-respond__actions">
              <button
                type="button"
                className="fq-btn fq-btn--primary"
                disabled={busy}
                onClick={() => respond('accept')}
              >
                Accept quote
              </button>
              <button
                type="button"
                className="fq-btn fq-btn--outline"
                disabled={busy}
                onClick={() => respond('decline')}
              >
                Decline
              </button>
            </div>
          </>
        )}

        {view.phase === 'done' && (
          <>
            <h1>Thank you</h1>
            <p>
              Your response to quote {view.quote.referenceNumber} has been recorded as{' '}
              <strong>{view.action === 'accept' ? 'accepted' : 'declined'}</strong>. Our
              operations team will be in touch.
            </p>
            <Link className="fq-btn fq-btn--ghost" to="/">
              Back to home
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
