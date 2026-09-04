import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QUOTE_STATUS_LABELS } from '../freightQuote/statusFlow'
import { QUOTE_STATUSES } from '../freightQuote/types'
import { useAdminAuth } from './adminAuthContext'
import {
  AdminApiError,
  downloadCsv,
  listQuotes,
  type AdminQuoteListItem,
} from './adminApi'

export function AdminQuotesList() {
  const { accessToken } = useAdminAuth()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<AdminQuoteListItem[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const result = await listQuotes(accessToken, { search: search || undefined, status: status || undefined, page })
      setRows(result.quotes)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : 'Could not load quotes.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, search, status, page])

  useEffect(() => {
    const timer = window.setTimeout(load, 250)
    return () => window.clearTimeout(timer)
  }, [load])

  const pageCount = Math.max(1, Math.ceil(total / 25))

  return (
    <div className="fq-admin__panel">
      <div className="fq-admin__head">
        <h1>Freight quotes</h1>
        <button
          type="button"
          className="fq-btn fq-btn--outline"
          onClick={() =>
            accessToken &&
            downloadCsv(
              accessToken,
              `/api/admin/quotes?format=csv${search ? `&search=${encodeURIComponent(search)}` : ''}${status ? `&status=${status}` : ''}`,
              'quotes.csv',
            )
          }
        >
          Export CSV
        </button>
      </div>

      <div className="fq-admin__filters">
        <input
          type="search"
          className="fq-field__control"
          placeholder="Reference, name, email, phone, suburb…"
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          aria-label="Search quotes"
        />
        <select
          className="fq-field__control"
          value={status}
          onChange={(e) => {
            setPage(1)
            setStatus(e.target.value)
          }}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {QUOTE_STATUSES.map((value) => (
            <option key={value} value={value}>
              {QUOTE_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="fq-banner fq-banner--error" role="alert">
          {error}
        </p>
      )}

      <div className="fq-admin__table-wrap">
        <table className="fq-admin__table">
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Created</th>
              <th scope="col">Customer</th>
              <th scope="col">Pickup</th>
              <th scope="col">Delivery</th>
              <th scope="col">Weight</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.referenceNumber}>
                <td>
                  <Link to={`/admin/quotes/${row.referenceNumber}`}>{row.referenceNumber}</Link>
                </td>
                <td>{new Date(row.createdAt).toLocaleDateString('en-AU')}</td>
                <td>
                  {row.customerName}
                  <br />
                  <span className="fq-admin__muted">{row.customerEmail}</span>
                </td>
                <td>{row.pickup}</td>
                <td>{row.delivery}</td>
                <td>{row.totalWeightKg} kg</td>
                <td>{row.servicePriority}</td>
                <td>
                  <span className={`fq-status fq-status--${row.status}`}>
                    {QUOTE_STATUS_LABELS[row.status]}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="fq-admin__empty">
                  No quotes match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="fq-admin__pager">
        <button
          type="button"
          className="fq-btn fq-btn--outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {pageCount} · {total} total
        </span>
        <button
          type="button"
          className="fq-btn fq-btn--outline"
          disabled={page >= pageCount}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
