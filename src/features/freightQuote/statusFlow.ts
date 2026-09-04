// Quote status lifecycle. The admin console uses `nextStatuses` to show only the
// transitions that make sense from where a quote currently sits; the API uses
// `canTransition` to reject anything else.
//
//   new → reviewing → quoted → accepted → booked → in_transit → delivered
//
// on_hold / declined / cancelled are reachable from most active states. A
// delivered or cancelled quote is terminal.

import type { QuoteStatus } from './types.js'

const TRANSITIONS: Record<QuoteStatus, readonly QuoteStatus[]> = {
  new: ['reviewing', 'quoted', 'on_hold', 'declined', 'cancelled'],
  reviewing: ['quoted', 'on_hold', 'declined', 'cancelled'],
  quoted: ['accepted', 'reviewing', 'on_hold', 'declined', 'cancelled'],
  accepted: ['booked', 'on_hold', 'cancelled'],
  booked: ['in_transit', 'on_hold', 'cancelled'],
  in_transit: ['delivered', 'on_hold'],
  delivered: [],
  on_hold: ['reviewing', 'quoted', 'accepted', 'booked', 'in_transit', 'cancelled'],
  declined: ['reviewing'],
  cancelled: [],
}

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  quoted: 'Quoted',
  accepted: 'Accepted',
  booked: 'Booked',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  on_hold: 'On Hold',
  declined: 'Declined',
  cancelled: 'Cancelled',
}

export function nextStatuses(current: QuoteStatus): readonly QuoteStatus[] {
  return TRANSITIONS[current] ?? []
}

export function canTransition(from: QuoteStatus, to: QuoteStatus): boolean {
  if (from === to) return true
  return nextStatuses(from).includes(to)
}

export function isTerminal(status: QuoteStatus): boolean {
  return nextStatuses(status).length === 0
}
