// Shared validation for the lightweight lead forms (homepage quick quote, the
// contact form, and the driver careers application). These go straight to email
// via Resend — there is no database record. The full structured freight quote
// is a separate system (src/features/freightQuote).

import { z } from 'zod'

const honeypot = z.string().max(0)
const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number')
  .max(20, 'Phone number is too long')

export const quickQuoteSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  companyName: z.string().trim().max(160).optional(),
  email: z.string().trim().email('Enter a valid email').max(200),
  phone,
  pickup: z.string().trim().min(3, 'Enter pickup suburb or postcode').max(160),
  delivery: z.string().trim().min(3, 'Enter delivery suburb or postcode').max(160),
  freight: z.string().trim().min(10, 'Describe the freight').max(4000),
  consent: z.literal(true, { error: 'Consent is required to submit' }),
  website: honeypot,
})
export type QuickQuoteValues = z.infer<typeof quickQuoteSchema>

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  email: z.string().trim().email('Enter a valid email').max(200),
  phone,
  message: z.string().trim().min(10, 'Tell us a little more').max(4000),
  website: honeypot,
})
export type ContactValues = z.infer<typeof contactSchema>

/** Careers résumé — 3 MB so the base64 payload stays under the serverless body limit. */
export const CAREERS_MAX_FILE_BYTES = 3 * 1024 * 1024
export const CAREERS_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export const careersRequestSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter your first name').max(80),
  lastName: z.string().trim().min(2, 'Enter your last name').max(80),
  email: z.string().trim().email('Enter a valid email').max(200),
  phone: z
    .string()
    .trim()
    .refine((v) => /^(?:\+?61|0)[2-478]\d{8}$/.test(v.replace(/[\s-]/g, '')), 'Enter a valid Australian phone number'),
  suburb: z.string().trim().min(2, 'Enter your suburb').max(120),
  role: z.string().trim().min(1, 'Select the role you are applying for').max(120),
  availability: z.string().trim().min(1).max(80),
  operatingArea: z.string().trim().min(1).max(80),
  licenceClass: z.string().trim().min(1).max(60),
  yearsExperience: z.string().trim().min(1).max(40),
  vehicleTypes: z.string().trim().min(3, 'List the vehicle types you have driven').max(1000),
  rightToWork: z.string().trim().min(1).max(10),
  notes: z.string().trim().max(2000).optional(),
  privacyAcknowledgement: z.literal(true, { error: 'Privacy acknowledgement is required' }),
  website: honeypot,
  resume: z.object({
    filename: z.string().trim().min(1).max(160),
    contentType: z.enum(CAREERS_ACCEPTED_TYPES),
    /** base64, no data: prefix */
    content: z
      .string()
      .min(1, 'Attach your résumé')
      .max(Math.ceil(CAREERS_MAX_FILE_BYTES * 1.4), 'File must be 3MB or smaller'),
  }),
})
export type CareersRequestValues = z.infer<typeof careersRequestSchema>
