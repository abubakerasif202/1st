// GET /api/admin/quotes — list + search + filter + CSV export. Admin only.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/adminAuth'
import { listToCsv } from '../_lib/adminCsv'
import { HttpError, requireMethod, sendError, sendJson } from '../_lib/http'
import { quoteRepository, type AdminQuoteListRow } from '../_lib/quoteRepository'

const PAGE_SIZE = 25

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value ?? '').trim()
}

function toListItem(row: AdminQuoteListRow) {
  return {
    referenceNumber: row.reference_number,
    createdAt: row.created_at,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    pickup: `${row.pickup_suburb} ${row.pickup_state}`,
    delivery: `${row.delivery_suburb} ${row.delivery_state}`,
    totalWeightKg: Number(row.total_weight_kg),
    totalVolumeM3: Number(row.total_volume_m3),
    totalItems: row.total_items,
    servicePriority: row.service_priority,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (!requireMethod(req, res, 'GET')) return

  try {
    await requireAdmin(req)

    const search = firstValue(req.query.search)
    const status = firstValue(req.query.status)
    const format = firstValue(req.query.format)
    const page = Math.max(1, Number.parseInt(firstValue(req.query.page) || '1', 10) || 1)

    if (format === 'csv') {
      // Export the whole filtered set, not just the current page.
      const { rows } = await quoteRepository().listQuotesForAdmin({
        search: search || undefined,
        status: status || undefined,
        limit: 5000,
        offset: 0,
      })
      res.status(200)
      res.setHeader('content-type', 'text/csv; charset=utf-8')
      res.setHeader('content-disposition', 'attachment; filename="quotes.csv"')
      res.send(listToCsv(rows))
      return
    }

    const { rows, total } = await quoteRepository().listQuotesForAdmin({
      search: search || undefined,
      status: status || undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    })

    sendJson(res, 200, {
      quotes: rows.map(toListItem),
      total,
      page,
      pageSize: PAGE_SIZE,
    })
  } catch (error) {
    if (!(error instanceof HttpError)) console.error('[api/admin/quotes]', error)
    sendError(res, error)
  }
}
