// CSV shaping for the admin exports. Uses the shared RFC-4180 + formula-guard
// helpers; this module only decides which columns go where.

import { buildCsv } from '../../src/features/freightQuote/csv'
import { FREIGHT_ITEM_TYPE_LABELS, SERVICE_PRIORITY_LABELS } from '../../src/features/freightQuote/labels'
import type { QuoteDetail } from '../../src/features/freightQuote/types'
import type { AdminQuoteListRow } from './quoteRepository'

const LIST_HEADERS = [
  'Reference',
  'Created',
  'Status',
  'Customer',
  'Email',
  'Phone',
  'Pickup',
  'Delivery',
  'Items',
  'Weight (kg)',
  'Volume (m3)',
  'Priority',
]

export function listToCsv(rows: ReadonlyArray<AdminQuoteListRow>): string {
  return buildCsv(
    LIST_HEADERS,
    rows.map((row) => [
      row.reference_number,
      row.created_at,
      row.status,
      row.customer_name,
      row.customer_email,
      row.customer_phone,
      `${row.pickup_suburb} ${row.pickup_state}`,
      `${row.delivery_suburb} ${row.delivery_state}`,
      row.total_items,
      row.total_weight_kg,
      row.total_volume_m3,
      row.service_priority,
    ]),
  )
}

export function quoteToCsv(quote: QuoteDetail): string {
  const headers = ['Field', 'Value']
  const rows: Array<[string, string | number]> = [
    ['Reference', quote.referenceNumber],
    ['Status', quote.status],
    ['Created', quote.createdAt],
    ['Company', quote.customerCompany ?? ''],
    ['Customer', quote.customerName],
    ['Email', quote.customerEmail],
    ['Phone', quote.customerPhone],
    ['Customer reference', quote.customerReference ?? ''],
    ['Pickup address', `${quote.pickup.addressLine1}, ${quote.pickup.suburb} ${quote.pickup.state} ${quote.pickup.postcode}`],
    ['Pickup contact', `${quote.pickup.contactName} ${quote.pickup.contactPhone}`],
    ['Pickup date', quote.pickup.pickupDate],
    ['Pickup cutoff', quote.pickup.cutoffTime],
    ['Delivery address', `${quote.delivery.addressLine1}, ${quote.delivery.suburb} ${quote.delivery.state} ${quote.delivery.postcode}`],
    ['Delivery contact', `${quote.delivery.contactName} ${quote.delivery.contactPhone}`],
    ['Delivery date', quote.delivery.requestedDeliveryDate ?? 'Flexible'],
    ['Delivery cutoff', quote.delivery.cutoffTime],
    ['Service priority', SERVICE_PRIORITY_LABELS[quote.servicePriority]],
    ['Delivery authority', quote.deliveryAuthority],
    ['ATL instructions', quote.atlInstructions ?? ''],
    ['Total items', quote.totals.totalItems],
    ['Total weight (kg)', quote.totals.totalWeightKg],
    ['Total volume (m3)', quote.totals.totalVolumeM3],
    ['Quoted price', quote.quotedPrice ?? ''],
    ['Quoted price GST', quote.quotedPriceGst ?? ''],
    ['Carrier', quote.carrierName ?? ''],
    ['Carrier consignment', quote.carrierConsignmentNumber ?? ''],
  ]
  quote.items.forEach((item, index) => {
    rows.push([
      `Item ${index + 1}`,
      `${item.quantity} x ${FREIGHT_ITEM_TYPE_LABELS[item.itemType]} · ${item.lengthCm}x${item.widthCm}x${item.heightCm}cm · ${item.weightEachKg}kg each · ${item.volumeM3}m3${item.dangerousGoods ? ' · DG' : ''}`,
    ])
  })
  return buildCsv(headers, rows)
}
