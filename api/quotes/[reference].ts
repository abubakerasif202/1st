// GET /api/quotes/:reference?token=... — confirmation lookup for a page refresh.
//
// The bare reference is never enough. The opaque respond_token issued at
// submission time must also match, so a guessed 1STCE-xxxxxx reveals nothing.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clientIp, HttpError, requireMethod, sendError, sendJson } from '../_lib/http.js'
import { quoteRepository } from '../_lib/quoteRepository.js'
import { enforceRateLimit } from '../_lib/rateLimit.js'
import { toQuoteDetail } from '../_lib/serialize.js'

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (!requireMethod(req, res, 'GET')) return

  try {
    // Blunt the (already infeasible) brute force of the 256-bit token.
    enforceRateLimit(`quote-view:${clientIp(req)}`, 60, 10 * 60 * 1000)

    const reference = firstValue(req.query.reference).trim()
    const token = firstValue(req.query.token).trim()
    if (!reference || !token) {
      throw new HttpError(400, 'A reference and token are required.')
    }

    const rpc = await quoteRepository().findByReferenceAndToken(reference, token)
    if (!rpc) throw new HttpError(404, 'That quote could not be found.')

    sendJson(res, 200, toQuoteDetail(rpc))
  } catch (error) {
    sendError(res, error)
  }
}
