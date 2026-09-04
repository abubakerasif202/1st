import { describe, expect, test } from 'vitest'
import { listToCsv, quoteToCsv } from '../../api/_lib/adminCsv'
import type { AdminQuoteListRow } from '../../api/_lib/quoteRepository'
import { makeQuoteDetail } from './fixtures/quoteDetail'

const row: AdminQuoteListRow = {
  reference_number: '1STCE-000001',
  created_at: '2026-09-04T02:00:00.000Z',
  status: 'new',
  customer_name: 'Doe, Jane',
  customer_email: 'jane@example.com',
  customer_phone: '+61400000000',
  pickup_suburb: 'Sydney',
  pickup_state: 'NSW',
  delivery_suburb: 'Brisbane',
  delivery_state: 'QLD',
  total_weight_kg: '200',
  total_volume_m3: '3.6',
  total_items: 2,
  service_priority: 'next_business_day',
}

describe('listToCsv', () => {
  const csv = listToCsv([row])

  test('has a header row and a BOM', () => {
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv).toContain('Reference,Created,Status,Customer')
  })

  test('quotes a customer name containing a comma', () => {
    expect(csv).toContain('"Doe, Jane"')
  })

  test('neutralises a phone number that starts with +', () => {
    expect(csv).toContain("'+61400000000")
  })
})

describe('quoteToCsv', () => {
  test('is a field/value sheet with one row per item', () => {
    const csv = quoteToCsv(makeQuoteDetail())
    expect(csv).toContain('Field,Value')
    expect(csv).toContain('Reference,1STCE-000001')
    expect(csv).toContain('Item 1,')
    expect(csv).toContain('Total weight (kg),200')
  })
})
