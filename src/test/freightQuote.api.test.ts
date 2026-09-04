import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import handler from '../../api/quotes'
import {
  __setQuoteRepository,
  type QuoteRepository,
} from '../../api/_lib/quoteRepository'
import type { QuoteDetailRpc } from '../../api/_lib/serialize'
import { emptyFreightItem } from '../features/freightQuote/schema'

// --- fakes -----------------------------------------------------------------

function fakeRow(reference: string, quote: Record<string, unknown>): QuoteDetailRpc {
  return {
    quote: {
      reference_number: reference,
      status: 'new',
      created_at: '2026-09-04T02:00:00.000Z',
      ...quote,
    } as QuoteDetailRpc['quote'],
    items: [],
    token: `token-for-${reference}`,
  }
}

class FakeRepo implements QuoteRepository {
  private byKey = new Map<string, QuoteDetailRpc>()
  private counter = 0
  createCalls = 0
  events: string[] = []

  async createQuote(input: { quote: Record<string, unknown> }): Promise<QuoteDetailRpc> {
    this.createCalls += 1
    const key = String(input.quote.idempotency_key ?? '')
    const existing = this.byKey.get(key)
    if (existing) return existing
    this.counter += 1
    const reference = `1STCE-${String(this.counter).padStart(6, '0')}`
    const row = fakeRow(reference, input.quote)
    if (key) this.byKey.set(key, row)
    return row
  }

  async findByReferenceAndToken(): Promise<QuoteDetailRpc | null> {
    return null
  }
  async respondToQuote(): Promise<QuoteDetailRpc> {
    throw new Error('not used')
  }
  async recordEvent(_ref: string, type: string): Promise<void> {
    this.events.push(type)
  }
  async listQuotesForAdmin() {
    return { rows: [], total: 0 }
  }
  async getQuoteForAdmin(): Promise<QuoteDetailRpc | null> {
    return null
  }
  async updateQuoteForAdmin(): Promise<QuoteDetailRpc> {
    throw new Error('not used')
  }
}

function mockRes() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    status(code: number) {
      res.statusCode = code
      return res
    },
    setHeader(key: string, value: string) {
      res.headers[key] = value
      return res
    },
    send(payload: unknown) {
      res.body = typeof payload === 'string' ? JSON.parse(payload) : payload
      return res
    },
  }
  return res
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    idempotencyKey: 'idem-abcdef12',
    termsVersion: '2026-09-01',
    website: '',
    form: {
      pickupAddressLine1: '1 Test St',
      pickupSuburb: 'Sydney',
      pickupState: 'NSW',
      pickupPostcode: '2000',
      pickupContactName: 'Pat Lee',
      pickupContactPhone: '0400 000 001',
      pickupDate: '2026-09-10',
      pickupReadyTime: '',
      pickupCutoffTime: '16:00',
      pickupTailgateRequired: false,
      pickupForkliftAvailable: false,
      pickupLoadingDockAvailable: false,
      pickupCustomerLoads: false,
      deliveryAddressLine1: '2 Test Ave',
      deliverySuburb: 'Brisbane',
      deliveryState: 'QLD',
      deliveryPostcode: '4000',
      deliveryContactName: 'Sam Ray',
      deliveryContactPhone: '0400 000 002',
      requestedDeliveryDate: '',
      deliveryCutoffTime: '17:00',
      deliveryTailgateRequired: false,
      deliveryForkliftAvailable: false,
      deliveryLoadingDockAvailable: false,
      deliveryReceiverUnloads: false,
      servicePriority: 'next_business_day',
      serviceSpecificDate: '',
      deliveryAuthority: 'signature_required',
      atlInstructions: '',
      customerName: 'Alex Kim',
      customerEmail: 'alex@example.com',
      customerPhone: '0400 000 003',
      customerNotes: '',
      termsAccepted: true,
      items: [emptyFreightItem()],
      ...(overrides.form as object | undefined),
    },
    ...overrides,
  }
}

let repo: FakeRepo

beforeEach(() => {
  repo = new FakeRepo()
  __setQuoteRepository(repo)
})
afterEach(() => {
  __setQuoteRepository(null)
  vi.restoreAllMocks()
})

describe('POST /api/quotes', () => {
  test('creates a quote and returns the reference + token', async () => {
    const res = mockRes()
    await handler(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { method: 'POST', body: validBody(), headers: { 'x-forwarded-for': '9.9.9.1' }, socket: {} } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res as any,
    )
    expect(res.statusCode).toBe(201)
    const body = res.body as { quote: { referenceNumber: string }; token: string }
    expect(body.quote.referenceNumber).toBe('1STCE-000001')
    expect(body.token).toBe('token-for-1STCE-000001')
    expect(repo.createCalls).toBe(1)
  })

  test('is idempotent — the same key never creates a second quote', async () => {
    const first = mockRes()
    const second = mockRes()
    const body = validBody({ idempotencyKey: 'idem-repeat01' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler({ method: 'POST', body, headers: { 'x-forwarded-for': '9.9.9.2' }, socket: {} } as any, first as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler({ method: 'POST', body, headers: { 'x-forwarded-for': '9.9.9.3' }, socket: {} } as any, second as any)

    const a = first.body as { quote: { referenceNumber: string } }
    const b = second.body as { quote: { referenceNumber: string } }
    expect(a.quote.referenceNumber).toBe(b.quote.referenceNumber)
    expect(repo.createCalls).toBe(2) // handler called twice…
    // …but the fake repo returned the same stored row the second time
  })

  test('rejects an invalid form with field errors', async () => {
    const res = mockRes()
    await handler(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { method: 'POST', body: validBody({ form: { pickupPostcode: 'nope' } }), headers: { 'x-forwarded-for': '9.9.9.4' }, socket: {} } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res as any,
    )
    expect(res.statusCode).toBe(400)
    const body = res.body as { fieldErrors?: Record<string, string[]> }
    expect(body.fieldErrors?.pickupPostcode?.[0]).toMatch(/postcode/i)
  })

  test('rejects a filled honeypot', async () => {
    const res = mockRes()
    await handler(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { method: 'POST', body: validBody({ website: 'http://spam' }), headers: { 'x-forwarded-for': '9.9.9.5' }, socket: {} } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res as any,
    )
    expect(res.statusCode).toBe(400)
    expect(repo.createCalls).toBe(0)
  })

  test('rejects non-POST', async () => {
    const res = mockRes()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler({ method: 'GET', headers: {}, socket: {} } as any, res as any)
    expect(res.statusCode).toBe(405)
  })
})
