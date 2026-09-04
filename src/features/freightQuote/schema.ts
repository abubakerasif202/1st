// Single source of validation truth for the freight quote wizard.
//
// The browser uses `quoteFormSchema` through react-hook-form; the API route
// re-parses the same request body with `quoteRequestSchema`. The schema has no
// transforms (no coerce / no default), so its input and output types match and
// react-hook-form types it cleanly — number fields are registered with
// `valueAsNumber` and blank wizard state comes from `emptyQuoteForm()`.
//
// Totals are never accepted from the client — the server recomputes them.

import type { DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import {
  AU_STATES,
  DELIVERY_AUTHORITIES,
  FREIGHT_ITEM_TYPES,
  SERVICE_PRIORITIES,
} from './types'

const AU_POSTCODE = /^\d{4}$/
const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

const trimmed = (max: number) => z.string().trim().max(max)
const requiredText = (label: string, min = 2, max = 200) =>
  z.string().trim().min(min, `${label} is required`).max(max, `${label} is too long`)

const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number')
  .max(20, 'Phone number is too long')
  .regex(/^[+()\d][\d\s()+-]{6,}$/, 'Enter a valid phone number')

const postcode = z.string().trim().regex(AU_POSTCODE, 'Enter a 4-digit Australian postcode')
const state = z.enum(AU_STATES, { error: 'Select a state' })
const timeField = z.string().trim().regex(TIME_24H, 'Use HH:MM (24-hour)')
const optionalTime = z.union([z.literal(''), timeField]).optional()
const dateField = z.string().trim().regex(ISO_DATE, 'Select a date')
const optionalDate = z.union([z.literal(''), dateField]).optional()
const positive = (label: string, max: number) =>
  z
    .number({ error: `Enter ${label}` })
    .refine((value) => Number.isFinite(value), `Enter ${label}`)
    .refine((value) => value > 0, 'Must be greater than 0')
    .refine((value) => value <= max, 'That value looks too large')

export const MAX_FREIGHT_ITEMS = 25

export const freightItemSchema = z.object({
  itemType: z.enum(FREIGHT_ITEM_TYPES, { error: 'Select an item type' }),
  description: trimmed(200).optional(),
  quantity: z
    .number({ error: 'Enter a quantity' })
    .int('Whole numbers only')
    .min(1, 'At least 1')
    .max(10000, 'That quantity looks too large'),
  lengthCm: positive('a length', 10000),
  widthCm: positive('a width', 10000),
  heightCm: positive('a height', 10000),
  weightEachKg: positive('a weight', 100000),
  stackable: z.boolean(),
  dangerousGoods: z.boolean(),
})
export type FreightItemValues = z.infer<typeof freightItemSchema>

const pickupShape = {
  pickupAddressLine1: requiredText('Pickup address'),
  pickupAddressLine2: trimmed(200).optional(),
  pickupSuburb: requiredText('Pickup suburb'),
  pickupState: state,
  pickupPostcode: postcode,
  pickupContactName: requiredText('Pickup contact name'),
  pickupContactPhone: phone,
  pickupDate: dateField,
  pickupReadyTime: optionalTime,
  pickupCutoffTime: timeField,
  pickupNotes: trimmed(1000).optional(),
  pickupTailgateRequired: z.boolean(),
  pickupForkliftAvailable: z.boolean(),
  pickupLoadingDockAvailable: z.boolean(),
  pickupCustomerLoads: z.boolean(),
}

const deliveryShape = {
  deliveryAddressLine1: requiredText('Delivery address'),
  deliveryAddressLine2: trimmed(200).optional(),
  deliverySuburb: requiredText('Delivery suburb'),
  deliveryState: state,
  deliveryPostcode: postcode,
  deliveryContactName: requiredText('Delivery contact name'),
  deliveryContactPhone: phone,
  requestedDeliveryDate: optionalDate,
  deliveryCutoffTime: timeField,
  deliveryNotes: trimmed(1000).optional(),
  deliveryTailgateRequired: z.boolean(),
  deliveryForkliftAvailable: z.boolean(),
  deliveryLoadingDockAvailable: z.boolean(),
  deliveryReceiverUnloads: z.boolean(),
}

const serviceShape = {
  servicePriority: z.enum(SERVICE_PRIORITIES, { error: 'Select a service priority' }),
  serviceSpecificDate: optionalDate,
  deliveryAuthority: z.enum(DELIVERY_AUTHORITIES, { error: 'Select a delivery authority' }),
  atlInstructions: trimmed(500).optional(),
}

const customerShape = {
  customerCompany: trimmed(200).optional(),
  customerName: requiredText('Your name'),
  customerEmail: z.string().trim().min(1, 'Enter your email').max(200).email('Enter a valid email'),
  customerPhone: phone,
  preferredContactMethod: z.enum(['email', 'phone']).or(z.literal('')).nullish(),
  customerReference: trimmed(100).optional(),
  customerNotes: trimmed(2000).optional(),
}

/** The shape react-hook-form drives. */
export const quoteFormSchema = z
  .object({
    ...pickupShape,
    ...deliveryShape,
    ...serviceShape,
    ...customerShape,
    termsAccepted: z.literal(true, { error: 'You must accept the freight terms to continue' }),
    items: z
      .array(freightItemSchema)
      .min(1, 'Add at least one freight item')
      .max(MAX_FREIGHT_ITEMS, `Maximum ${MAX_FREIGHT_ITEMS} items`),
  })
  .superRefine((value, ctx) => {
    if (value.deliveryAuthority === 'atl' && !value.atlInstructions?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['atlInstructions'],
        message: 'Authority to Leave needs written placement instructions',
      })
    }
    if (value.servicePriority === 'specific_date' && !value.serviceSpecificDate?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['serviceSpecificDate'],
        message: 'Choose the specific date this freight must move',
      })
    }
  })

export type QuoteFormValues = z.infer<typeof quoteFormSchema>

/** What the API route accepts: form values plus transport metadata. */
export const quoteRequestSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(200),
  termsVersion: z.string().trim().min(1).max(50),
  website: z.string().max(200).optional(), // honeypot — the handler rejects any non-empty value
  form: quoteFormSchema,
})

export type QuoteRequestPayload = z.infer<typeof quoteRequestSchema>

/** Blank freight line. */
export function emptyFreightItem(): FreightItemValues {
  return {
    itemType: 'pallet',
    description: '',
    quantity: 1,
    lengthCm: 120,
    widthCm: 120,
    heightCm: 120,
    weightEachKg: 100,
    stackable: true,
    dangerousGoods: false,
  }
}

/** Blank wizard state for react-hook-form's defaultValues. */
export function emptyQuoteForm(): DefaultValues<QuoteFormValues> {
  return {
    pickupAddressLine1: '',
    pickupAddressLine2: '',
    pickupSuburb: '',
    pickupState: undefined,
    pickupPostcode: '',
    pickupContactName: '',
    pickupContactPhone: '',
    pickupDate: '',
    pickupReadyTime: '',
    pickupCutoffTime: '',
    pickupNotes: '',
    pickupTailgateRequired: false,
    pickupForkliftAvailable: false,
    pickupLoadingDockAvailable: false,
    pickupCustomerLoads: false,
    deliveryAddressLine1: '',
    deliveryAddressLine2: '',
    deliverySuburb: '',
    deliveryState: undefined,
    deliveryPostcode: '',
    deliveryContactName: '',
    deliveryContactPhone: '',
    requestedDeliveryDate: '',
    deliveryCutoffTime: '',
    deliveryNotes: '',
    deliveryTailgateRequired: false,
    deliveryForkliftAvailable: false,
    deliveryLoadingDockAvailable: false,
    deliveryReceiverUnloads: false,
    servicePriority: undefined,
    serviceSpecificDate: '',
    deliveryAuthority: undefined,
    atlInstructions: '',
    customerCompany: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    preferredContactMethod: undefined,
    customerReference: '',
    customerNotes: '',
    termsAccepted: undefined,
    items: [emptyFreightItem()],
  }
}
