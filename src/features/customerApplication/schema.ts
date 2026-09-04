// Customer credit / onboarding application. Mirrors public.customer_applications.
//
// Payment method and terms are REQUESTED, never granted here — the record is
// stored with status "pending_review" and payment_terms_approved left null.

import type { DefaultValues } from 'react-hook-form'
import { z } from 'zod'
import { AU_STATES } from '../freightQuote/types.js'

const trimmed = (max: number) => z.string().trim().max(max)
const required = (label: string, min = 2, max = 200) =>
  z.string().trim().min(min, `${label} is required`).max(max, `${label} is too long`)
const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number')
  .max(20)
  .regex(/^[+()\d][\d\s()+-]{6,}$/, 'Enter a valid phone number')
const email = z.string().trim().min(1).max(200).email('Enter a valid email')
const optionalTime = z
  .union([z.literal(''), z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM')])
  .optional()

export const PAYMENT_METHODS = ['direct_debit', 'account_invoice', 'prepaid', 'other'] as const
export const PAYMENT_TERMS = ['prepaid', '1_day', '7_days', '14_days'] as const

export const customerApplicationSchema = z
  .object({
    legalBusinessName: required('Legal business name'),
    tradingName: trimmed(200).optional(),
    abn: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s/g, ''))
      .pipe(z.string().regex(/^\d{11}$/, 'Enter an 11-digit ABN')),
    acn: z
      .union([
        z.literal(''),
        z
          .string()
          .trim()
          .transform((value) => value.replace(/\s/g, ''))
          .pipe(z.string().regex(/^\d{9}$/, 'Enter a 9-digit ACN')),
      ])
      .optional(),

    businessAddress: required('Business address'),
    suburb: required('Suburb'),
    state: z.enum(AU_STATES, { error: 'Select a state' }),
    postcode: z.string().trim().regex(/^\d{4}$/, 'Enter a 4-digit postcode'),

    primaryContactName: required('Primary contact name'),
    primaryContactPosition: trimmed(120).optional(),
    primaryContactEmail: email,
    primaryContactPhone: phone,

    accountsContactName: trimmed(160).optional(),
    accountsContactEmail: z.union([z.literal(''), email]).optional(),
    accountsContactPhone: z.union([z.literal(''), phone]).optional(),

    operatingOpenTime: optionalTime,
    operatingCloseTime: optionalTime,
    saturdayHours: trimmed(120).optional(),
    sundayHours: trimmed(120).optional(),
    pickupCutoffTime: optionalTime,
    deliveryCutoffTime: optionalTime,

    siteForkliftAvailable: z.boolean(),
    siteLoadingDockAvailable: z.boolean(),
    siteTailgateRequired: z.boolean(),
    siteSpecialInstructions: trimmed(1000).optional(),

    paymentMethodRequested: z.enum(PAYMENT_METHODS, { error: 'Select a payment method' }),
    paymentTermsRequested: z.enum(PAYMENT_TERMS, { error: 'Select requested terms' }),

    authorisedSignatoryName: required('Authorised signatory name'),
    authorisedSignatoryPosition: required('Signatory position'),
    authorisedSignatoryEmail: email,
    authorisedSignatoryPhone: phone,
    typedSignature: required('Typed signature', 2, 120),
    signatureDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Select a date'),

    termsAccepted: z.literal(true, { error: 'You must accept the freight terms to continue' }),
  })
  .superRefine((value, ctx) => {
    if (value.typedSignature.trim().toLowerCase() !== value.authorisedSignatoryName.trim().toLowerCase()) {
      ctx.addIssue({
        code: 'custom',
        path: ['typedSignature'],
        message: 'The typed signature must match the authorised signatory name',
      })
    }
  })

export type CustomerApplicationValues = z.infer<typeof customerApplicationSchema>

export const customerApplicationRequestSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(200),
  termsVersion: z.string().trim().min(1).max(50),
  website: z.string().max(200).optional(),
  form: customerApplicationSchema,
})

export function emptyCustomerApplication(): DefaultValues<CustomerApplicationValues> {
  return {
    legalBusinessName: '',
    tradingName: '',
    abn: '',
    acn: '',
    businessAddress: '',
    suburb: '',
    state: undefined,
    postcode: '',
    primaryContactName: '',
    primaryContactPosition: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    accountsContactName: '',
    accountsContactEmail: '',
    accountsContactPhone: '',
    operatingOpenTime: '',
    operatingCloseTime: '',
    saturdayHours: '',
    sundayHours: '',
    pickupCutoffTime: '',
    deliveryCutoffTime: '',
    siteForkliftAvailable: false,
    siteLoadingDockAvailable: false,
    siteTailgateRequired: false,
    siteSpecialInstructions: '',
    paymentMethodRequested: undefined,
    paymentTermsRequested: undefined,
    authorisedSignatoryName: '',
    authorisedSignatoryPosition: '',
    authorisedSignatoryEmail: '',
    authorisedSignatoryPhone: '',
    typedSignature: '',
    signatureDate: '',
    termsAccepted: undefined,
  }
}
