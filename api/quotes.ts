// POST /api/quotes — create a freight quote.
//
//  1. rate limit + body-size guard
//  2. honeypot
//  3. server-side Zod validation
//  4. normalise + recompute totals server-side
//  5. atomic DB write (create_quote RPC: reference + quote + items + event)
//  6. idempotency is enforced inside the RPC by idempotency_key
//  7. operational email AFTER the commit — a failure is logged, never fatal
//  8. respond with the confirmation payload + opaque view token

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { quoteRequestSchema } from '../src/features/freightQuote/schema.js'
import { env } from './_lib/env.js'
import { clientIp, HttpError, readJsonBody, requireMethod, sendError, sendJson } from './_lib/http.js'
import { normaliseQuote } from './_lib/normalise.js'
import { quoteRepository } from './_lib/quoteRepository.js'
import { enforceRateLimit } from './_lib/rateLimit.js'
import { toQuoteDetail } from './_lib/serialize.js'
import { sendCustomerQuoteAcknowledgement, sendInternalQuoteNotification } from './_lib/resend.js'

function fieldErrorMap(error: z.ZodError): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const issue of error.issues) {
    // strip the leading "form." segment so paths match the wizard field names
    const path = issue.path.filter((p) => p !== 'form').join('.')
    ;(map[path] ??= []).push(issue.message)
  }
  return map
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (!requireMethod(req, res, 'POST')) return

  try {
    enforceRateLimit(`quotes:${clientIp(req)}`, 12, 10 * 60 * 1000)

    const body = await readJsonBody(req)
    const parsed = quoteRequestSchema.safeParse(body)
    if (!parsed.success) {
      throw new HttpError(400, 'Some details need attention.', fieldErrorMap(parsed.error))
    }

    const { form, idempotencyKey, website } = parsed.data
    if (website && website.length > 0) {
      throw new HttpError(400, 'Submission could not be processed.')
    }

    const normalised = normaliseQuote(form, {
      idempotencyKey,
      termsVersion: env.freightTermsVersion(), // server is authoritative
    })

    const rpc = await quoteRepository().createQuote(normalised)
    const quote = toQuoteDetail(rpc)

    // DB is committed. Email is best-effort — and only on a genuine first
    // submission, never on an idempotency-key replay.
    if (rpc.created !== false) {
      const [internal, ack] = await Promise.all([
        sendInternalQuoteNotification(quote).catch((e) => ({ sent: false, error: String(e) })),
        sendCustomerQuoteAcknowledgement(quote).catch((e) => ({ sent: false, error: String(e) })),
      ])
      if (!internal.sent || !ack.sent) {
        await quoteRepository()
          .recordEvent(quote.referenceNumber, 'email_delivery', { internal, customer: ack }, 'system')
          .catch(() => undefined)
      }
    }

    sendJson(res, 201, { quote, token: rpc.token })
  } catch (error) {
    sendError(res, error)
  }
}
