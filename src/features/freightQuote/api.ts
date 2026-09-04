// Browser-side API client for the freight quote system. The wizard talks only to
// this module; it never touches Supabase directly.
//
// Failure model: any non-2xx or network error becomes a typed QuoteApiError so
// the UI can tell "your input is invalid" (validation) apart from "our systems
// are down, nothing was lost" (infrastructure).

import type { QuoteFormValues } from './schema.js'
import type { QuoteDetail } from './types.js'

export type QuoteApiErrorKind = 'validation' | 'infrastructure' | 'not_found' | 'unknown'

export class QuoteApiError extends Error {
  readonly kind: QuoteApiErrorKind
  readonly fieldErrors?: Record<string, string[]>

  constructor(kind: QuoteApiErrorKind, message: string, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'QuoteApiError'
    this.kind = kind
    this.fieldErrors = fieldErrors
  }
}

export const INFRASTRUCTURE_MESSAGE =
  'We’re temporarily unable to submit your freight quote. Your information has not been lost from this form. Please try again shortly.'

export interface SubmitQuoteArgs {
  form: QuoteFormValues
  idempotencyKey: string
  termsVersion: string
}

interface ErrorBody {
  error?: string
  message?: string
  fieldErrors?: Record<string, string[]>
}

async function parseError(response: Response): Promise<QuoteApiError> {
  let body: ErrorBody = {}
  try {
    body = (await response.json()) as ErrorBody
  } catch {
    // non-JSON error page
  }
  const message = body.message || body.error
  if (response.status === 400 || response.status === 422) {
    return new QuoteApiError('validation', message || 'Some details need attention.', body.fieldErrors)
  }
  if (response.status === 404) {
    return new QuoteApiError('not_found', message || 'That quote could not be found.')
  }
  if (response.status === 503 || response.status === 502 || response.status === 500) {
    return new QuoteApiError('infrastructure', INFRASTRUCTURE_MESSAGE)
  }
  return new QuoteApiError('unknown', message || 'Something went wrong. Please try again.')
}

export interface SubmitQuoteResult {
  quote: QuoteDetail
  /** Opaque token for viewing this quote again (confirmation refresh, respond page). */
  token: string
}

export async function submitQuote({ form, idempotencyKey, termsVersion }: SubmitQuoteArgs): Promise<SubmitQuoteResult> {
  let response: Response
  try {
    response = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ form, idempotencyKey, termsVersion, website: '' }),
    })
  } catch {
    throw new QuoteApiError('infrastructure', INFRASTRUCTURE_MESSAGE)
  }
  if (!response.ok) throw await parseError(response)
  return (await response.json()) as SubmitQuoteResult
}

/**
 * Confirmation lookup for a page refresh. The reference alone is not enough — the
 * server also requires the opaque token issued at submission time (kept in
 * sessionStorage and appended to the confirmation URL).
 */
export async function loadQuoteConfirmation(reference: string, token: string): Promise<QuoteDetail> {
  let response: Response
  try {
    response = await fetch(
      `/api/quotes/${encodeURIComponent(reference)}?token=${encodeURIComponent(token)}`,
    )
  } catch {
    throw new QuoteApiError('infrastructure', INFRASTRUCTURE_MESSAGE)
  }
  if (!response.ok) throw await parseError(response)
  return (await response.json()) as QuoteDetail
}
