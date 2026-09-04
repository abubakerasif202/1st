// Browser client for the secure customer accept/decline page.

import { INFRASTRUCTURE_MESSAGE, QuoteApiError } from './api'
import type { QuoteDetail } from './types'

async function parse(response: Response): Promise<QuoteApiError> {
  let message = 'Something went wrong.'
  try {
    const body = (await response.json()) as { message?: string; error?: string }
    message = body.message || body.error || message
  } catch {
    /* non-JSON */
  }
  if (response.status === 404) return new QuoteApiError('not_found', message)
  if (response.status === 409) return new QuoteApiError('validation', message)
  if (response.status >= 500) return new QuoteApiError('infrastructure', INFRASTRUCTURE_MESSAGE)
  return new QuoteApiError('unknown', message)
}

export async function loadRespondQuote(reference: string, token: string): Promise<QuoteDetail> {
  let response: Response
  try {
    response = await fetch(
      `/api/quotes/${encodeURIComponent(reference)}/respond?token=${encodeURIComponent(token)}`,
    )
  } catch {
    throw new QuoteApiError('infrastructure', INFRASTRUCTURE_MESSAGE)
  }
  if (!response.ok) throw await parse(response)
  return (await response.json()) as QuoteDetail
}

export async function submitQuoteResponse(
  reference: string,
  token: string,
  action: 'accept' | 'decline',
): Promise<QuoteDetail> {
  let response: Response
  try {
    response = await fetch(`/api/quotes/${encodeURIComponent(reference)}/respond`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, action }),
    })
  } catch {
    throw new QuoteApiError('infrastructure', INFRASTRUCTURE_MESSAGE)
  }
  if (!response.ok) throw await parse(response)
  return (await response.json()) as QuoteDetail
}
