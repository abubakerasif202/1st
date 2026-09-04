import { describe, expect, test } from 'vitest'
import {
  emptyFreightItem,
  MAX_FREIGHT_ITEMS,
  quoteFormSchema,
} from '../features/freightQuote/schema'

function validForm(overrides: Record<string, unknown> = {}) {
  return {
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
    ...overrides,
  }
}

describe('quoteFormSchema', () => {
  test('accepts a complete, valid form', () => {
    const result = quoteFormSchema.safeParse(validForm())
    expect(result.success).toBe(true)
  })

  test('rejects a non-4-digit postcode', () => {
    const result = quoteFormSchema.safeParse(validForm({ pickupPostcode: '20001' }))
    expect(result.success).toBe(false)
    expect(JSON.stringify(result)).toContain('4-digit')
  })

  test('rejects a state outside the AU enum', () => {
    const result = quoteFormSchema.safeParse(validForm({ pickupState: 'ZZ' }))
    expect(result.success).toBe(false)
  })

  test('requires terms acceptance', () => {
    const result = quoteFormSchema.safeParse(validForm({ termsAccepted: false }))
    expect(result.success).toBe(false)
    expect(JSON.stringify(result)).toContain('accept the freight terms')
  })

  test('ATL authority requires placement instructions', () => {
    const atl = quoteFormSchema.safeParse(
      validForm({ deliveryAuthority: 'atl', atlInstructions: '' }),
    )
    expect(atl.success).toBe(false)
    expect(JSON.stringify(atl)).toContain('placement instructions')

    const withInstructions = quoteFormSchema.safeParse(
      validForm({ deliveryAuthority: 'atl', atlInstructions: 'Under the verandah' }),
    )
    expect(withInstructions.success).toBe(true)
  })

  test('specific-date priority requires a date', () => {
    const missing = quoteFormSchema.safeParse(validForm({ servicePriority: 'specific_date' }))
    expect(missing.success).toBe(false)

    const present = quoteFormSchema.safeParse(
      validForm({ servicePriority: 'specific_date', serviceSpecificDate: '2026-09-12' }),
    )
    expect(present.success).toBe(true)
  })

  test('requires at least one freight item', () => {
    const result = quoteFormSchema.safeParse(validForm({ items: [] }))
    expect(result.success).toBe(false)
  })

  test('rejects more than the maximum items', () => {
    const items = Array.from({ length: MAX_FREIGHT_ITEMS + 1 }, emptyFreightItem)
    const result = quoteFormSchema.safeParse(validForm({ items }))
    expect(result.success).toBe(false)
  })

  test('rejects a non-positive dimension', () => {
    const result = quoteFormSchema.safeParse(
      validForm({ items: [{ ...emptyFreightItem(), lengthCm: 0 }] }),
    )
    expect(result.success).toBe(false)
  })
})
