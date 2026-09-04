// Data-access boundary for the freight quote system. The handlers depend on the
// QuoteRepository interface; the Supabase implementation is the only concrete
// one in production, and tests pass a fake.

import type { SupabaseClient } from '@supabase/supabase-js'
import { adminClient } from './supabaseAdmin.js'
import { HttpError } from './http.js'
import type { NormalisedQuote } from './normalise.js'
import type { QuoteDetailRpc } from './serialize.js'

export interface AdminQuoteListParams {
  search?: string
  status?: string
  limit: number
  offset: number
}

export interface AdminQuoteListRow {
  reference_number: string
  created_at: string
  status: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_suburb: string
  pickup_state: string
  delivery_suburb: string
  delivery_state: string
  total_weight_kg: number | string
  total_volume_m3: number | string
  total_items: number
  service_priority: string
}

export interface AdminQuotePatch {
  status?: string
  quoted_price?: number | null
  quoted_price_gst?: number | null
  carrier_name?: string | null
  carrier_consignment_number?: string | null
  internal_notes?: string | null
  quote_sent_at?: string | null
}

export interface QuoteRepository {
  createQuote(input: NormalisedQuote): Promise<QuoteDetailRpc>
  findByReferenceAndToken(reference: string, token: string): Promise<QuoteDetailRpc | null>
  respondToQuote(reference: string, token: string, action: 'accept' | 'decline'): Promise<QuoteDetailRpc>
  recordEvent(reference: string, eventType: string, data: Record<string, unknown>, actor: string): Promise<void>
  listQuotesForAdmin(params: AdminQuoteListParams): Promise<{ rows: AdminQuoteListRow[]; total: number }>
  getQuoteForAdmin(reference: string): Promise<QuoteDetailRpc | null>
  updateQuoteForAdmin(reference: string, patch: AdminQuotePatch): Promise<QuoteDetailRpc>
}

function assertNoError(context: string, error: { message: string } | null): void {
  if (error) throw new HttpError(500, `${context}: ${error.message}`)
}

class SupabaseQuoteRepository implements QuoteRepository {
  constructor(private readonly db: SupabaseClient) {}

  async createQuote(input: NormalisedQuote): Promise<QuoteDetailRpc> {
    const { data, error } = await this.db.rpc('create_quote', {
      p_quote: input.quote,
      p_items: input.items,
    })
    assertNoError('create_quote', error)
    if (!data) throw new HttpError(500, 'create_quote returned no data')
    return data as QuoteDetailRpc
  }

  async findByReferenceAndToken(reference: string, token: string): Promise<QuoteDetailRpc | null> {
    const { data, error } = await this.db
      .from('quotes')
      .select('id')
      .eq('reference_number', reference)
      .eq('respond_token', token)
      .maybeSingle()
    assertNoError('find quote', error)
    if (!data) return null
    const detail = await this.db.rpc('quote_detail_json', { p_id: (data as { id: string }).id })
    assertNoError('quote_detail_json', detail.error)
    return detail.data as QuoteDetailRpc
  }

  async respondToQuote(reference: string, token: string, action: 'accept' | 'decline'): Promise<QuoteDetailRpc> {
    const { data, error } = await this.db.rpc('respond_to_quote', {
      p_reference: reference,
      p_token: token,
      p_action: action,
    })
    if (error) {
      if (error.message.includes('not found')) throw new HttpError(404, 'Quote not found.')
      if (error.message.includes('not open')) throw new HttpError(409, 'This quote is not open for a response.')
      throw new HttpError(400, error.message)
    }
    return data as QuoteDetailRpc
  }

  async recordEvent(
    reference: string,
    eventType: string,
    data: Record<string, unknown>,
    actor: string,
  ): Promise<void> {
    const { data: row, error } = await this.db
      .from('quotes')
      .select('id')
      .eq('reference_number', reference)
      .maybeSingle()
    if (error || !row) return // best-effort audit only
    await this.db.from('quote_events').insert({
      quote_id: (row as { id: string }).id,
      event_type: eventType,
      event_data: data,
      actor,
    })
  }

  async listQuotesForAdmin(params: AdminQuoteListParams): Promise<{ rows: AdminQuoteListRow[]; total: number }> {
    let query = this.db
      .from('quotes')
      .select(
        'reference_number, created_at, status, customer_name, customer_email, customer_phone, pickup_suburb, pickup_state, delivery_suburb, delivery_state, total_weight_kg, total_volume_m3, total_items, service_priority',
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })
      .range(params.offset, params.offset + params.limit - 1)

    if (params.status) query = query.eq('status', params.status)
    if (params.search) {
      const term = params.search.replace(/[%,()]/g, ' ').trim()
      query = query.or(
        [
          `reference_number.ilike.%${term}%`,
          `customer_name.ilike.%${term}%`,
          `customer_email.ilike.%${term}%`,
          `customer_phone.ilike.%${term}%`,
          `pickup_suburb.ilike.%${term}%`,
          `delivery_suburb.ilike.%${term}%`,
        ].join(','),
      )
    }

    const { data, error, count } = await query
    assertNoError('list quotes', error)
    return { rows: (data ?? []) as AdminQuoteListRow[], total: count ?? 0 }
  }

  async getQuoteForAdmin(reference: string): Promise<QuoteDetailRpc | null> {
    const { data, error } = await this.db
      .from('quotes')
      .select('id')
      .eq('reference_number', reference)
      .maybeSingle()
    assertNoError('get quote', error)
    if (!data) return null
    const detail = await this.db.rpc('quote_detail_json', { p_id: (data as { id: string }).id })
    assertNoError('quote_detail_json', detail.error)
    return detail.data as QuoteDetailRpc
  }

  async updateQuoteForAdmin(reference: string, patch: AdminQuotePatch): Promise<QuoteDetailRpc> {
    const { data, error } = await this.db
      .from('quotes')
      .update(patch)
      .eq('reference_number', reference)
      .select('id')
      .maybeSingle()
    assertNoError('update quote', error)
    if (!data) throw new HttpError(404, 'Quote not found.')
    const detail = await this.db.rpc('quote_detail_json', { p_id: (data as { id: string }).id })
    assertNoError('quote_detail_json', detail.error)
    return detail.data as QuoteDetailRpc
  }
}

let singleton: QuoteRepository | null = null

export function quoteRepository(): QuoteRepository {
  if (!singleton) singleton = new SupabaseQuoteRepository(adminClient())
  return singleton
}

/** Test seam. */
export function __setQuoteRepository(repo: QuoteRepository | null): void {
  singleton = repo
}
