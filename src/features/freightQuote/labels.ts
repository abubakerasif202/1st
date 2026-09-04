// Human-readable labels for the freight enums. Kept apart from types.ts so that
// file stays value/type declarations only and React Fast Refresh is happy.

import type {
  DeliveryAuthority,
  FreightItemType,
  ServicePriority,
} from './types'

export const SERVICE_PRIORITY_LABELS: Record<ServicePriority, string> = {
  urgent: 'Urgent / ASAP',
  next_business_day: 'Next Business Day',
  three_to_five_days: '3–5 Business Days',
  specific_date: 'Specific Required Date',
}

export const DELIVERY_AUTHORITY_LABELS: Record<DeliveryAuthority, string> = {
  atl: 'Authority to Leave (ATL)',
  signature_required: 'Signature Required',
}

export const FREIGHT_ITEM_TYPE_LABELS: Record<FreightItemType, string> = {
  pallet: 'Pallet',
  box: 'Box',
  carton: 'Carton',
  crate: 'Crate',
  skid: 'Skid',
  machinery: 'Machinery',
  other: 'Other',
}
