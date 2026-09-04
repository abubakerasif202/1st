// Operational email via Resend's REST API (no SDK — one POST per message).
//
// Rules:
//  * never called during unit tests (VITEST guard)
//  * a missing key or address disables sending rather than throwing — the quote
//    is already saved and must not be lost over an email problem
//  * logs carry the reference and route only, never customer PII

import { formatQuoteSummary } from '../../src/features/freightQuote/clipboard.js'
import type { QuoteDetail } from '../../src/features/freightQuote/types.js'
import { env } from './env.js'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface EmailResult {
  sent: boolean
  skippedReason?: string
  error?: string
}

interface ResendPayload {
  from: string
  to: string[]
  subject: string
  text: string
  reply_to?: string
}

async function send(payload: ResendPayload): Promise<EmailResult> {
  if (process.env.VITEST) return { sent: false, skippedReason: 'test' }
  const key = env.resendApiKey()
  if (!key) return { sent: false, skippedReason: 'RESEND_API_KEY not configured' }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const body = await response.text()
      return { sent: false, error: `Resend ${response.status}: ${body.slice(0, 200)}` }
    }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: error instanceof Error ? error.message : 'network error' }
  }
}

function route(quote: QuoteDetail): string {
  return `${quote.pickup.suburb} ${quote.pickup.state} → ${quote.delivery.suburb} ${quote.delivery.state}`
}

export async function sendInternalQuoteNotification(quote: QuoteDetail): Promise<EmailResult> {
  const from = env.quoteFromEmail()
  const to = env.quoteInternalEmail()
  if (!from || !to) return { sent: false, skippedReason: 'from/internal address not configured' }

  return send({
    from,
    to: [to],
    reply_to: quote.customerEmail,
    subject: `New Freight Quote — ${quote.referenceNumber} — ${route(quote)}`,
    text: [
      `A new freight quote request has been submitted.`,
      ``,
      `Reference: ${quote.referenceNumber}`,
      `Route:     ${route(quote)}`,
      `Priority:  ${quote.servicePriority}`,
      `Items:     ${quote.totals.totalItems} · ${quote.totals.totalWeightKg} kg · ${quote.totals.totalVolumeM3} m³`,
      ``,
      formatQuoteSummary(quote),
    ].join('\n'),
  })
}

export async function sendCustomerQuoteAcknowledgement(quote: QuoteDetail): Promise<EmailResult> {
  const from = env.quoteFromEmail()
  if (!from) return { sent: false, skippedReason: 'from address not configured' }

  const confirmationUrl = `${env.siteUrl()}/quote/${encodeURIComponent(quote.referenceNumber)}/confirmation`

  return send({
    from,
    to: [quote.customerEmail],
    subject: `We’ve received your freight quote request — ${quote.referenceNumber}`,
    text: [
      `Hi ${quote.customerName},`,
      ``,
      `Thanks for your freight quote request. Our operations team will review it and`,
      `send you a priced quote.`,
      ``,
      `Your reference: ${quote.referenceNumber}`,
      `Route:          ${route(quote)}`,
      ``,
      `View your request:`,
      confirmationUrl,
      ``,
      `1st Class Express`,
    ].join('\n'),
  })
}
