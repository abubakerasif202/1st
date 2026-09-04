// {value,label} option lists for the wizard selects and radio groups.

import {
  DELIVERY_AUTHORITY_LABELS,
  FREIGHT_ITEM_TYPE_LABELS,
  SERVICE_PRIORITY_LABELS,
} from './labels.js'
import {
  AU_STATES,
  DELIVERY_AUTHORITIES,
  FREIGHT_ITEM_TYPES,
  SERVICE_PRIORITIES,
} from './types.js'

export const STATE_OPTIONS = AU_STATES.map((value) => ({ value, label: value }))

export const FREIGHT_ITEM_TYPE_OPTIONS = FREIGHT_ITEM_TYPES.map((value) => ({
  value,
  label: FREIGHT_ITEM_TYPE_LABELS[value],
}))

export const SERVICE_PRIORITY_OPTIONS = SERVICE_PRIORITIES.map((value) => ({
  value,
  label: SERVICE_PRIORITY_LABELS[value],
  description:
    value === 'urgent'
      ? 'Move as soon as a vehicle can be assigned.'
      : value === 'next_business_day'
        ? 'Collected and delivered the next working day.'
        : value === 'three_to_five_days'
          ? 'Standard scheduled linehaul window.'
          : 'Pick an exact date the freight must move.',
}))

export const DELIVERY_AUTHORITY_OPTIONS = DELIVERY_AUTHORITIES.map((value) => ({
  value,
  label: DELIVERY_AUTHORITY_LABELS[value],
  description:
    value === 'atl'
      ? 'Driver may leave the freight without a signature. Placement instructions required.'
      : 'Someone must be on site to sign for the freight.',
}))

export const CONTACT_METHOD_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
] as const

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'direct_debit', label: 'Direct Debit' },
  { value: 'account_invoice', label: 'Account / Invoice' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'other', label: 'Other' },
] as const

export const PAYMENT_TERMS_OPTIONS = [
  { value: 'prepaid', label: 'Prepaid' },
  { value: '1_day', label: '1 Day' },
  { value: '7_days', label: '7 Days' },
  { value: '14_days', label: '14 Days' },
] as const
