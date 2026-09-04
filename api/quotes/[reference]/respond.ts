// /api/quotes/:reference/respond
//   GET  ?token=...            → quote summary + price for the response page
//   POST { token, action }     → accept or decline (token required, not the bare reference)

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { clientIp, HttpError, readJsonBody, sendError, sendJson } from '../../_lib/http.js'
import { quoteRepository } from '../../_lib/quoteRepository.js'
import { enforceRateLimit } from '../../_lib/rateLimit.js'
import { toQuoteDetail } from '../../_lib/serialize.js'

const bodySchema = z.object({
  token: z.string().trim().min(16).max(200),
  action: z.enum(['accept', 'decline']),
})

function refParam(req: VercelRequest): string {
  const value = req.query.reference
  return (Array.isArray(value) ? value[0] : value ?? '').trim()
}

function tokenQuery(req: VercelRequest): string {
  const value = req.query.token
  return (Array.isArray(value) ? value[0] : value ?? '').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const reference = refParam(req)
    if (!reference) throw new HttpError(400, 'A reference is required.')

    if (req.method === 'GET') {
      enforceRateLimit(`respond-view:${clientIp(req)}`, 60, 10 * 60 * 1000)
      const token = tokenQuery(req)
      if (!token) throw new HttpError(400, 'A token is required.')
      const rpc = await quoteRepository().findByReferenceAndToken(reference, token)
      if (!rpc) throw new HttpError(404, 'That quote could not be found.')
      sendJson(res, 200, toQuoteDetail(rpc, { includePricing: true }))
      return
    }

    if (req.method === 'POST') {
      enforceRateLimit(`respond:${clientIp(req)}`, 20, 10 * 60 * 1000)
      const parsed = bodySchema.safeParse(await readJsonBody(req))
      if (!parsed.success) throw new HttpError(400, 'Invalid request.')
      const rpc = await quoteRepository().respondToQuote(
        reference,
        parsed.data.token,
        parsed.data.action,
      )
      await quoteRepository()
        .recordEvent(reference, 'customer_response_api', { action: parsed.data.action }, 'customer')
        .catch(() => undefined)
      sendJson(res, 200, toQuoteDetail(rpc, { includePricing: true }))
      return
    }

    res.setHeader('Allow', 'GET, POST')
    sendJson(res, 405, { error: 'method_not_allowed', message: 'Use GET or POST.' })
  } catch (error) {
    sendError(res, error)
  }
}
