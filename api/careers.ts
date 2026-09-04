// POST /api/careers — driver application. Validated, then emailed to the careers
// mailbox via Resend with the résumé as an attachment. No database record.
//
// The résumé arrives as base64 JSON (≤ 3 MB) so it stays under the serverless
// request-body limit without needing a multipart parser or object storage.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import {
  CAREERS_ACCEPTED_TYPES,
  CAREERS_MAX_FILE_BYTES,
  careersRequestSchema,
} from '../src/features/enquiry/schema.js'
import { env } from './_lib/env.js'
import { clientIp, HttpError, readJsonBody, requireMethod, sendError, sendJson } from './_lib/http.js'
import { cleanHeader, sendViaResend } from './_lib/mailer.js'
import { enforceRateLimit } from './_lib/rateLimit.js'

// Vercel's serverless request-body ceiling is ~4.5 MB and cannot be raised.
// base64 of a 3 MB file (~4 MB) plus the form fields fits under it.
const BODY_LIMIT = 4_400_000

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const issue of error.issues) (map[issue.path.join('.')] ??= []).push(issue.message)
  return map
}

const safeFilename = (name: string): string =>
  name.replace(/[^\w.\-() ]+/g, '_').replace(/^\.+/, '').slice(-150) || 'resume'

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (!requireMethod(req, res, 'POST')) return

  try {
    enforceRateLimit(`careers:${clientIp(req)}`, 8, 15 * 60 * 1000)

    const parsed = careersRequestSchema.safeParse(await readJsonBody(req, BODY_LIMIT))
    if (!parsed.success) throw new HttpError(400, 'Some details need attention.', fieldErrors(parsed.error))

    const data = parsed.data
    if (data.website && data.website.length > 0) throw new HttpError(400, 'Submission could not be processed.')

    // Decode the résumé to check the real byte size and that it is valid base64.
    let bytes: Buffer
    try {
      bytes = Buffer.from(data.resume.content, 'base64')
    } catch {
      throw new HttpError(400, 'The résumé file could not be read.')
    }
    if (bytes.length === 0 || bytes.length > CAREERS_MAX_FILE_BYTES) {
      throw new HttpError(400, 'The résumé must be a file of 3MB or smaller.')
    }
    if (!CAREERS_ACCEPTED_TYPES.includes(data.resume.contentType)) {
      throw new HttpError(400, 'Accepted résumé formats: PDF, DOC or DOCX.')
    }

    const from = env.quoteFromEmail()
    const to = env.careersToEmail()
    if (!from || !to) throw new HttpError(503, 'Careers email is not configured.')

    const result = await sendViaResend({
      from,
      to: [to],
      replyTo: data.email,
      subject: `Driver Application — ${cleanHeader(data.role)} — ${cleanHeader(`${data.firstName} ${data.lastName}`)}`,
      text: [
        'New driver application from the website.',
        '',
        `Name:          ${data.firstName} ${data.lastName}`,
        `Email:         ${data.email}`,
        `Phone:         ${data.phone}`,
        `Suburb:        ${data.suburb}`,
        `Role:          ${data.role}`,
        `Availability:  ${data.availability}`,
        `Operating:     ${data.operatingArea}`,
        `Licence class: ${data.licenceClass}`,
        `Experience:    ${data.yearsExperience}`,
        `Right to work: ${data.rightToWork}`,
        `Vehicles:      ${data.vehicleTypes}`,
        '',
        `Notes: ${data.notes ?? '-'}`,
        '',
        'Résumé attached.',
      ].join('\n'),
      attachments: [
        {
          filename: safeFilename(data.resume.filename),
          content: bytes.toString('base64'),
          contentType: data.resume.contentType,
        },
      ],
    })

    if (!result.sent && !result.skippedReason) {
      console.error('[api/careers] resend failed:', result.error)
      throw new HttpError(502, 'We could not send your application. Please email it to us instead.')
    }

    sendJson(res, 200, { ok: true })
  } catch (error) {
    sendError(res, error)
  }
}
