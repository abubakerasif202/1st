// Admin console API client. Every call carries the Supabase session's access
// token; the server authorises against ADMIN_EMAILS.

import type { QuoteDetail, QuoteStatus } from '../freightQuote/types.js'

export interface AdminQuoteListItem {
  referenceNumber: string
  createdAt: string
  status: QuoteStatus
  customerName: string
  customerEmail: string
  customerPhone: string
  pickup: string
  delivery: string
  totalWeightKg: number
  totalVolumeM3: number
  totalItems: number
  servicePriority: string
}

export interface AdminQuoteListResponse {
  quotes: AdminQuoteListItem[]
  total: number
  page: number
  pageSize: number
}

export interface AdminQuotePatch {
  status?: QuoteStatus
  quotedPrice?: number | null
  quotedPriceGst?: number | null
  carrierName?: string | null
  carrierConsignmentNumber?: string | null
  internalNotes?: string | null
  markQuoteSent?: boolean
}

export class AdminApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }
}

async function unwrap<T>(response: Response): Promise<T> {
  if (response.ok) return (await response.json()) as T
  let message = `Request failed (${response.status})`
  try {
    const body = (await response.json()) as { message?: string; error?: string }
    message = body.message || body.error || message
  } catch {
    /* non-JSON */
  }
  throw new AdminApiError(response.status, message)
}

export interface ListParams {
  search?: string
  status?: string
  page?: number
}

export async function listQuotes(token: string, params: ListParams): Promise<AdminQuoteListResponse> {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.page) query.set('page', String(params.page))
  const response = await fetch(`/api/admin/quotes?${query.toString()}`, {
    headers: authHeaders(token),
  })
  return unwrap<AdminQuoteListResponse>(response)
}

export async function getQuote(token: string, reference: string): Promise<QuoteDetail> {
  const response = await fetch(`/api/admin/quotes/${encodeURIComponent(reference)}`, {
    headers: authHeaders(token),
  })
  return unwrap<QuoteDetail>(response)
}

export async function updateQuote(
  token: string,
  reference: string,
  patch: AdminQuotePatch,
): Promise<QuoteDetail> {
  const response = await fetch(`/api/admin/quotes/${encodeURIComponent(reference)}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(patch),
  })
  return unwrap<QuoteDetail>(response)
}

/** Fetch a CSV (list or single quote) and hand the browser a download. */
export async function downloadCsv(
  token: string,
  path: string,
  filename: string,
): Promise<void> {
  const response = await fetch(path, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new AdminApiError(response.status, 'Export failed.')
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
