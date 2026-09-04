import { describe, expect, test } from 'vitest'
import { customerApplicationSchema } from '../features/customerApplication/schema'

function valid(overrides: Record<string, unknown> = {}) {
  return {
    legalBusinessName: 'Test Freight Co',
    abn: '12 345 678 901',
    businessAddress: '1 Depot Rd',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    primaryContactName: 'Jo Blogs',
    primaryContactEmail: 'jo@test.com',
    primaryContactPhone: '0400 000 000',
    siteForkliftAvailable: false,
    siteLoadingDockAvailable: false,
    siteTailgateRequired: false,
    paymentMethodRequested: 'account_invoice',
    paymentTermsRequested: '14_days',
    authorisedSignatoryName: 'Jo Blogs',
    authorisedSignatoryPosition: 'Director',
    authorisedSignatoryEmail: 'jo@test.com',
    authorisedSignatoryPhone: '0400 000 000',
    typedSignature: 'Jo Blogs',
    signatureDate: '2026-09-04',
    termsAccepted: true,
    ...overrides,
  }
}

describe('customerApplicationSchema', () => {
  test('accepts a valid application and normalises the ABN', () => {
    const result = customerApplicationSchema.safeParse(valid())
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.abn).toBe('12345678901')
  })

  test('rejects an ABN that is not 11 digits', () => {
    expect(customerApplicationSchema.safeParse(valid({ abn: '123' })).success).toBe(false)
  })

  test('requires the typed signature to match the signatory name', () => {
    const result = customerApplicationSchema.safeParse(
      valid({ typedSignature: 'Someone Else' }),
    )
    expect(result.success).toBe(false)
    expect(JSON.stringify(result)).toContain('must match the authorised signatory name')
  })

  test('requires terms acceptance', () => {
    expect(customerApplicationSchema.safeParse(valid({ termsAccepted: false })).success).toBe(false)
  })

  test('requires a payment method and terms selection', () => {
    expect(
      customerApplicationSchema.safeParse(valid({ paymentTermsRequested: undefined })).success,
    ).toBe(false)
  })
})
