import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatQuoteSummary } from '../freightQuote/clipboard.js'
import { QUOTE_STATUS_LABELS, nextStatuses } from '../freightQuote/statusFlow.js'
import type { QuoteDetail, QuoteStatus } from '../freightQuote/types.js'
import { useAdminAuth } from './adminAuthContext.js'
import {
  AdminApiError,
  downloadCsv,
  getQuote,
  updateQuote,
  type AdminQuotePatch,
} from './adminApi.js'

export function AdminQuoteDetail() {
  const { reference = '' } = useParams()
  const { accessToken } = useAdminAuth()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [price, setPrice] = useState('')
  const [gst, setGst] = useState('')
  const [carrier, setCarrier] = useState('')
  const [consignment, setConsignment] = useState('')
  const [notes, setNotes] = useState('')

  const hydrate = useCallback((next: QuoteDetail) => {
    setQuote(next)
    setPrice(next.quotedPrice != null ? String(next.quotedPrice) : '')
    setGst(next.quotedPriceGst != null ? String(next.quotedPriceGst) : '')
    setCarrier(next.carrierName ?? '')
    setConsignment(next.carrierConsignmentNumber ?? '')
    setNotes(next.internalNotes ?? '')
  }, [])

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    getQuote(accessToken, reference)
      .then((q) => !cancelled && hydrate(q))
      .catch((err: unknown) =>
        setError(err instanceof AdminApiError ? err.message : 'Could not load the quote.'),
      )
    return () => {
      cancelled = true
    }
  }, [accessToken, reference, hydrate])

  const patch = useCallback(
    async (body: AdminQuotePatch) => {
      if (!accessToken) return
      setSaving(true)
      setError(null)
      try {
        hydrate(await updateQuote(accessToken, reference, body))
      } catch (err) {
        setError(err instanceof AdminApiError ? err.message : 'Update failed.')
      } finally {
        setSaving(false)
      }
    },
    [accessToken, reference, hydrate],
  )

  if (error && !quote) {
    return (
      <div className="fq-admin__panel">
        <p className="fq-banner fq-banner--error" role="alert">
          {error}
        </p>
        <Link className="fq-btn fq-btn--outline" to="/admin/quotes">
          Back to list
        </Link>
      </div>
    )
  }

  if (!quote) return <p role="status">Loading…</p>

  const num = (value: string): number | null => {
    const trimmed = value.trim()
    if (trimmed === '') return null
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : null
  }

  return (
    <div className="fq-admin__panel">
      <div className="fq-admin__head">
        <h1>{quote.referenceNumber}</h1>
        <div className="fq-admin__actions">
          <button
            type="button"
            className="fq-btn fq-btn--outline"
            onClick={() => navigator.clipboard?.writeText(formatQuoteSummary(quote))}
          >
            Copy
          </button>
          <button type="button" className="fq-btn fq-btn--outline" onClick={() => window.print()}>
            Print
          </button>
          <button
            type="button"
            className="fq-btn fq-btn--outline"
            onClick={() =>
              accessToken &&
              downloadCsv(
                accessToken,
                `/api/admin/quotes/${encodeURIComponent(quote.referenceNumber)}?format=csv`,
                `${quote.referenceNumber}.csv`,
              )
            }
          >
            Export CSV
          </button>
          <Link className="fq-btn fq-btn--link" to="/admin/quotes">
            Back to list
          </Link>
        </div>
      </div>

      {error && (
        <p className="fq-banner fq-banner--error" role="alert">
          {error}
        </p>
      )}

      <div className="fq-admin__grid">
        <section className="fq-admin__card">
          <h2>Status</h2>
          <p>
            Current: <strong>{QUOTE_STATUS_LABELS[quote.status]}</strong>
          </p>
          <div className="fq-admin__status-buttons">
            {nextStatuses(quote.status).map((status: QuoteStatus) => (
              <button
                key={status}
                type="button"
                className="fq-btn fq-btn--outline"
                disabled={saving}
                onClick={() => patch({ status })}
              >
                → {QUOTE_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>

        <section className="fq-admin__card">
          <h2>Pricing (manual)</h2>
          <label className="fq-field">
            <span className="fq-field__label">Quote ex GST (AUD)</span>
            <input className="fq-field__control" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="fq-field">
            <span className="fq-field__label">GST (AUD)</span>
            <input className="fq-field__control" inputMode="decimal" value={gst} onChange={(e) => setGst(e.target.value)} />
          </label>
          <button
            type="button"
            className="fq-btn fq-btn--primary"
            disabled={saving}
            onClick={() => patch({ quotedPrice: num(price), quotedPriceGst: num(gst) })}
          >
            Save pricing
          </button>
          <button
            type="button"
            className="fq-btn fq-btn--outline"
            disabled={saving}
            onClick={() => patch({ markQuoteSent: true })}
          >
            Mark quote sent
          </button>
          {quote.quoteSentAt && (
            <p className="fq-admin__muted">Sent {new Date(quote.quoteSentAt).toLocaleString('en-AU')}</p>
          )}
        </section>

        <section className="fq-admin__card">
          <h2>Carrier</h2>
          <label className="fq-field">
            <span className="fq-field__label">Carrier name</span>
            <input className="fq-field__control" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
          </label>
          <label className="fq-field">
            <span className="fq-field__label">Carrier consignment number</span>
            <input className="fq-field__control" value={consignment} onChange={(e) => setConsignment(e.target.value)} />
          </label>
          <button
            type="button"
            className="fq-btn fq-btn--primary"
            disabled={saving}
            onClick={() =>
              patch({ carrierName: carrier || null, carrierConsignmentNumber: consignment || null })
            }
          >
            Save carrier
          </button>
        </section>

        <section className="fq-admin__card">
          <h2>Internal notes</h2>
          <textarea
            className="fq-field__control"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="button"
            className="fq-btn fq-btn--primary"
            disabled={saving}
            onClick={() => patch({ internalNotes: notes || null })}
          >
            Save notes
          </button>
        </section>
      </div>

      <section className="fq-admin__card">
        <h2>Quote details</h2>
        <pre className="fq-admin__summary">{formatQuoteSummary(quote)}</pre>
      </section>
    </div>
  )
}
