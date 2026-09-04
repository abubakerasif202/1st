// "COPY DETAILS" on the confirmation page produces this block. It is deliberately
// plain text with aligned labels so it pastes cleanly into email, a spreadsheet
// cell, or a carrier booking screen.

import { SERVICE_PRIORITY_LABELS, DELIVERY_AUTHORITY_LABELS } from './labels'
import type { QuoteDetail } from './types'

function yesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

function fullAddress(parts: { addressLine1: string; addressLine2?: string; suburb: string; state: string; postcode: string }): string {
  return [parts.addressLine1, parts.addressLine2, `${parts.suburb} ${parts.state} ${parts.postcode}`]
    .filter(Boolean)
    .join(', ')
}

export function formatQuoteSummary(quote: QuoteDetail): string {
  const lines: string[] = []
  const push = (text = '') => lines.push(text)

  push('1ST CLASS EXPRESS')
  push('QUOTE / CONSIGNMENT REFERENCE')
  push()
  push(`Reference:  ${quote.referenceNumber}`)
  push(`Submitted:  ${new Date(quote.createdAt).toLocaleString('en-AU')}`)
  push(`Status:     ${quote.status}`)
  push()

  push('CUSTOMER')
  push(`Company:  ${quote.customerCompany ?? '-'}`)
  push(`Contact:  ${quote.customerName}`)
  push(`Phone:    ${quote.customerPhone}`)
  push(`Email:    ${quote.customerEmail}`)
  if (quote.customerReference) push(`PO / Ref: ${quote.customerReference}`)
  push()

  push('PICKUP')
  push(`Address:  ${fullAddress(quote.pickup)}`)
  push(`Contact:  ${quote.pickup.contactName}`)
  push(`Phone:    ${quote.pickup.contactPhone}`)
  push(`Date:     ${quote.pickup.pickupDate}`)
  push(`Ready:    ${quote.pickup.readyTime ?? '-'}`)
  push(`Cutoff:   ${quote.pickup.cutoffTime}`)
  push(`Tailgate: ${yesNo(quote.pickup.handling.tailgateRequired)}`)
  push(`Forklift: ${yesNo(quote.pickup.handling.forkliftAvailable)}`)
  push(`Dock:     ${yesNo(quote.pickup.handling.loadingDockAvailable)}`)
  if (quote.pickup.notes) push(`Notes:    ${quote.pickup.notes}`)
  push()

  push('DELIVERY')
  push(`Address:  ${fullAddress(quote.delivery)}`)
  push(`Contact:  ${quote.delivery.contactName}`)
  push(`Phone:    ${quote.delivery.contactPhone}`)
  push(`Date:     ${quote.delivery.requestedDeliveryDate ?? 'Not specified'}`)
  push(`Cutoff:   ${quote.delivery.cutoffTime}`)
  push(`Tailgate: ${yesNo(quote.delivery.handling.tailgateRequired)}`)
  push(`Forklift: ${yesNo(quote.delivery.handling.forkliftAvailable)}`)
  push(`Dock:     ${yesNo(quote.delivery.handling.loadingDockAvailable)}`)
  if (quote.delivery.notes) push(`Notes:    ${quote.delivery.notes}`)
  push()

  push('FREIGHT')
  quote.items.forEach((item, index) => {
    push()
    push(`Item ${index + 1}`)
    push(`  Type:        ${item.itemType}`)
    push(`  Qty:         ${item.quantity}`)
    push(`  Dimensions:  ${item.lengthCm} x ${item.widthCm} x ${item.heightCm} cm (L x W x H)`)
    push(`  Weight each: ${item.weightEachKg} kg`)
    push(`  Line volume: ${item.volumeM3} m3`)
    push(`  Stackable:   ${yesNo(item.stackable)}`)
    push(`  Dangerous:   ${yesNo(item.dangerousGoods)}`)
    if (item.description) push(`  Description: ${item.description}`)
  })
  push()
  push(`TOTAL ITEMS:   ${quote.totals.totalItems}`)
  push(`TOTAL WEIGHT:  ${quote.totals.totalWeightKg} kg`)
  push(`TOTAL VOLUME:  ${quote.totals.totalVolumeM3} m3`)
  push()

  push(`SERVICE:            ${SERVICE_PRIORITY_LABELS[quote.servicePriority]}`)
  if (quote.serviceSpecificDate) push(`REQUIRED DATE:      ${quote.serviceSpecificDate}`)
  push(`DELIVERY AUTHORITY: ${DELIVERY_AUTHORITY_LABELS[quote.deliveryAuthority]}`)
  if (quote.atlInstructions) push(`ATL PLACEMENT:      ${quote.atlInstructions}`)
  push()

  push('NOTES:')
  push(quote.customerReference ? `Customer reference: ${quote.customerReference}` : '-')

  return lines.join('\n')
}
