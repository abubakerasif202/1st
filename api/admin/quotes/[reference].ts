// /api/admin/quotes/:reference
//   GET   ?format=csv → full quote (admin fields), or a single-quote CSV
//   PATCH               → status / price / carrier / notes updates

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { QUOTE_STATUSES } from '../../../src/features/freightQuote/types.js'
import { canTransition } from '../../../src/features/freightQuote/statusFlow.js'
import { requireAdmin } from '../../_lib/adminAuth.js'
import { quoteToCsv } from '../../_lib/adminCsv.js'
import { HttpError, readJsonBody, sendError, sendJson } from '../../_lib/http.js'
import { quoteRepository, type AdminQuotePatch } from '../../_lib/quoteRepository.js'
import { toQuoteDetail } from '../../_lib/serialize.js'

const patchSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  quotedPrice: z.number().nonnegative().max(1_000_000).nullable().optional(),
  quotedPriceGst: z.number().nonnegative().max(1_000_000).nullable().optional(),
  carrierName: z.string().trim().max(200).nullable().optional(),
  carrierConsignmentNumber: z.string().trim().max(200).nullable().optional(),
  internalNotes: z.string().trim().max(10_000).nullable().optional(),
  markQuoteSent: z.boolean().optional(),
})

function refParam(req: VercelRequest): string {
  const value = req.query.reference
  return (Array.isArray(value) ? value[0] : value ?? '').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await requireAdmin(req)
    const reference = refParam(req)
    if (!reference) throw new HttpError(400, 'A reference is required.')

    if (req.method === 'GET') {
      const rpc = await quoteRepository().getQuoteForAdmin(reference)
      if (!rpc) throw new HttpError(404, 'Quote not found.')
      const detail = toQuoteDetail(rpc, { includePricing: true, includeInternal: true })

      const format = Array.isArray(req.query.format) ? req.query.format[0] : req.query.format
      if (format === 'csv') {
        const safeName = reference.replace(/[^A-Za-z0-9-]/g, '') || 'quote'
        res.status(200)
        res.setHeader('content-type', 'text/csv; charset=utf-8')
        res.setHeader('content-disposition', `attachment; filename="${safeName}.csv"`)
        res.send(quoteToCsv(detail))
        return
      }
      sendJson(res, 200, detail)
      return
    }

    if (req.method === 'PATCH') {
      const parsed = patchSchema.safeParse(await readJsonBody(req))
      if (!parsed.success) throw new HttpError(400, 'Invalid update.')

      const current = await quoteRepository().getQuoteForAdmin(reference)
      if (!current) throw new HttpError(404, 'Quote not found.')

      const patch: AdminQuotePatch = {}
      const body = parsed.data
      if (body.status) {
        if (!canTransition(current.quote.status, body.status)) {
          throw new HttpError(409, `Cannot move a ${current.quote.status} quote to ${body.status}.`)
        }
        patch.status = body.status
      }
      if (body.quotedPrice !== undefined) patch.quoted_price = body.quotedPrice
      if (body.quotedPriceGst !== undefined) patch.quoted_price_gst = body.quotedPriceGst
      if (body.carrierName !== undefined) patch.carrier_name = body.carrierName
      if (body.carrierConsignmentNumber !== undefined) {
        patch.carrier_consignment_number = body.carrierConsignmentNumber
      }
      if (body.internalNotes !== undefined) patch.internal_notes = body.internalNotes
      if (body.markQuoteSent) patch.quote_sent_at = new Date().toISOString()

      if (Object.keys(patch).length === 0) throw new HttpError(400, 'Nothing to update.')

      const updated = await quoteRepository().updateQuoteForAdmin(reference, patch)
      await quoteRepository()
        .recordEvent(reference, 'admin_update', { fields: Object.keys(patch) }, 'admin')
        .catch(() => undefined)
      sendJson(res, 200, toQuoteDetail(updated, { includePricing: true, includeInternal: true }))
      return
    }

    res.setHeader('Allow', 'GET, PATCH')
    sendJson(res, 405, { error: 'method_not_allowed', message: 'Use GET or PATCH.' })
  } catch (error) {
    sendError(res, error)
  }
}
