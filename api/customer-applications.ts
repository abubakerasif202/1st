// POST /api/customer-applications — submit a credit / onboarding application.
//
// Credit is NEVER granted here. The row is stored status = 'pending_review'
// with payment_terms_approved left null; the requested method/terms are kept
// separately as a request.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { customerApplicationRequestSchema } from '../src/features/customerApplication/schema.js'
import { env } from './_lib/env.js'
import { adminClient } from './_lib/supabaseAdmin.js'
import { clientIp, HttpError, readJsonBody, requireMethod, sendError, sendJson } from './_lib/http.js'
import { normaliseApplication } from './_lib/normaliseApplication.js'
import { enforceRateLimit } from './_lib/rateLimit.js'

function fieldErrorMap(error: z.ZodError): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const path = issue.path.filter((p) => p !== 'form').join('.')
    ;(map[path] ??= []).push(issue.message)
  }
  return map
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (!requireMethod(req, res, 'POST')) return

  try {
    enforceRateLimit(`applications:${clientIp(req)}`, 8, 15 * 60 * 1000)

    const parsed = customerApplicationRequestSchema.safeParse(await readJsonBody(req))
    if (!parsed.success) {
      throw new HttpError(400, 'Some details need attention.', fieldErrorMap(parsed.error))
    }

    const { form, idempotencyKey, website } = parsed.data
    if (website && website.length > 0) {
      throw new HttpError(400, 'Submission could not be processed.')
    }

    const payload = normaliseApplication(form, {
      idempotencyKey,
      termsVersion: env.freightTermsVersion(),
    })

    const { data, error } = await adminClient().rpc('create_customer_application', { p_app: payload })
    if (error) {
      console.error('[api/customer-applications] create_customer_application:', error.message)
      throw new HttpError(500, 'A database error occurred. Please try again.')
    }

    const row = data as { application_reference: string; status: string } | null
    if (!row) throw new HttpError(500, 'No application returned.')

    sendJson(res, 201, {
      applicationReference: row.application_reference,
      status: row.status,
    })
  } catch (error) {
    sendError(res, error)
  }
}
