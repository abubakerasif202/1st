import { describe, expect, test } from 'vitest'
import { normaliseQuote } from '../../api/_lib/normalise'
import { emptyFreightItem, quoteFormSchema } from '../features/freightQuote/schema'

function form(overrides: Record<string, unknown> = {}) {
  const base = {
    pickupAddressLine1: '1 Test St',
    pickupSuburb: 'Sydney',
    pickupState: 'NSW',
    pickupPostcode: '2000',
    pickupContactName: 'Pat Lee',
    pickupContactPhone: '0400 000 001',
    pickupDate: '2026-09-10',
    pickupReadyTime: '',
    pickupCutoffTime: '16:00',
    pickupTailgateRequired: true,
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
    items: [
      { ...emptyFreightItem(), quantity: 2, lengthCm: 120, widthCm: 100, heightCm: 150, weightEachKg: 100 },
      { ...emptyFreightItem(), quantity: 1, lengthCm: 50, widthCm: 50, heightCm: 50, weightEachKg: 20 },
    ],
    ...overrides,
  }
  return quoteFormSchema.parse(base)
}

describe('normaliseQuote', () => {
  test('recomputes totals server-side, ignoring anything the client might send', () => {
    const { quote, items } = normaliseQuote(form(), {
      idempotencyKey: 'idem-123456',
      termsVersion: '2026-09-01',
    })
    // 2 * (1.2*1.0*1.5) + 1 * (0.5*0.5*0.5) = 3.6 + 0.125
    expect(quote.total_items).toBe(3)
    expect(quote.total_weight_kg).toBe(220)
    expect(quote.total_volume_m3).toBe(3.725)
    expect(items).toHaveLength(2)
    expect(items[0].volume_m3).toBe(3.6)
    expect(items[1].volume_m3).toBe(0.125)
  })

  test('maps camelCase form fields to snake_case columns', () => {
    const { quote } = normaliseQuote(form(), { idempotencyKey: 'idem-123456', termsVersion: 'v1' })
    expect(quote.pickup_suburb).toBe('Sydney')
    expect(quote.delivery_state).toBe('QLD')
    expect(quote.pickup_tailgate_required).toBe(true)
    expect(quote.idempotency_key).toBe('idem-123456')
    expect(quote.terms_version).toBe('v1')
  })

  test('blank optional times/dates become null, not empty strings', () => {
    const { quote } = normaliseQuote(form(), { idempotencyKey: 'idem-123456', termsVersion: 'v1' })
    expect(quote.pickup_ready_time).toBeNull()
    expect(quote.requested_delivery_date).toBeNull()
  })
})
