// POST /api/enquiry — homepage quick-quote and the contact form.
//
// These are lightweight leads: validated, then emailed to the operations mailbox
// via Resend. No database record (the structured freight quote is /api/quotes).

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { contactSchema, quickQuoteSchema } from '../src/features/enquiry/schema.js'
import { env } from './_lib/env.js'
import { clientIp, HttpError, readJsonBody, requireMethod, sendError, sendJson } from './_lib/http.js'
import { cleanHeader, sendViaResend } from './_lib/mailer.js'
import { enforceRateLimit } from './_lib/rateLimit.js'

const requestSchema = z.discriminatedUnion('kind', [
  quickQuoteSchema.extend({ kind: z.literal('quick-quote') }),
  contactSchema.extend({ kind: z.literal('contact') }),
])

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const issue of error.issues) (map[issue.path.join('.')] ??= []).push(issue.message)
  return map
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (!requireMethod(req, res, 'POST')) return

  try {
    enforceRateLimit(`enquiry:${clientIp(req)}`, 15, 10 * 60 * 1000)

    const parsed = requestSchema.safeParse(await readJsonBody(req))
    if (!parsed.success) throw new HttpError(400, 'Some details need attention.', fieldErrors(parsed.error))

    const data = parsed.data
    if (data.website && data.website.length > 0) throw new HttpError(400, 'Submission could not be processed.')

    const from = env.quoteFromEmail()
    const to = env.enquiryToEmail()
    if (!from || !to) throw new HttpError(503, 'Enquiry email is not configured.')

    const lines =
      data.kind === 'quick-quote'
        ? [
            'New quick quote request from the website.',
            '',
            `Name:     ${data.name}`,
            `Company:  ${data.companyName ?? '-'}`,
            `Email:    ${data.email}`,
            `Phone:    ${data.phone}`,
            `Pickup:   ${data.pickup}`,
            `Delivery: ${data.delivery}`,
            '',
            'Freight:',
            data.freight,
          ]
        : [
            'New website enquiry.',
            '',
            `Name:  ${data.name}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone}`,
            '',
            'Message:',
            data.message,
          ]

    const subject =
      data.kind === 'quick-quote'
        ? `Quick Quote — ${cleanHeader(data.name)} — ${cleanHeader(data.pickup)} → ${cleanHeader(data.delivery)}`
        : `Website Enquiry — ${cleanHeader(data.name)}`

    const result = await sendViaResend({
      from,
      to: [to],
      replyTo: data.email,
      subject,
      text: lines.join('\n'),
    })

    if (!result.sent && !result.skippedReason) {
      console.error('[api/enquiry] resend failed:', result.error)
      throw new HttpError(502, 'We could not send your request. Please call or email us instead.')
    }

    sendJson(res, 200, { ok: true })
  } catch (error) {
    sendError(res, error)
  }
}
