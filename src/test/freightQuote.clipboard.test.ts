import { describe, expect, test } from 'vitest'
import { formatQuoteSummary } from '../features/freightQuote/clipboard'
import { makeQuoteDetail } from './fixtures/quoteDetail'

describe('formatQuoteSummary', () => {
  const text = formatQuoteSummary(makeQuoteDetail())

  test('leads with the company and reference', () => {
    expect(text.startsWith('1ST CLASS EXPRESS')).toBe(true)
    expect(text).toContain('Reference:  1STCE-000001')
  })

  test('includes both addresses and contacts', () => {
    expect(text).toContain('1 Test St, Sydney NSW 2000')
    expect(text).toContain('2 Test Ave, Brisbane QLD 4000')
    expect(text).toContain('Pat Lee')
    expect(text).toContain('Sam Ray')
  })

  test('lists each item with dimensions and totals', () => {
    expect(text).toContain('Item 1')
    expect(text).toContain('120 x 100 x 150 cm')
    expect(text).toContain('TOTAL ITEMS:   2')
    expect(text).toContain('TOTAL WEIGHT:  200 kg')
    expect(text).toContain('TOTAL VOLUME:  3.6 m3')
  })

  test('shows the handling flags for both ends', () => {
    expect(text).toMatch(/PICKUP[\s\S]*Tailgate: Yes/)
    expect(text).toMatch(/DELIVERY[\s\S]*Forklift: Yes/)
  })

  test('renders ATL instructions when present', () => {
    const atl = formatQuoteSummary(
      makeQuoteDetail({ deliveryAuthority: 'atl', atlInstructions: 'Under the verandah' }),
    )
    expect(atl).toContain('ATL PLACEMENT:      Under the verandah')
  })
})
