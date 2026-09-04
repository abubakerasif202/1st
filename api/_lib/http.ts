// Small request/response helpers shared by every function. Kept framework-light:
// the handlers receive Vercel's (req, res) which are Node's IncomingMessage /
// ServerResponse plus a few extras.

import type { VercelRequest, VercelResponse } from '@vercel/node'

export const MAX_BODY_BYTES = 64 * 1024 // 64 KB — a quote payload is a few KB

export class HttpError extends Error {
  readonly status: number
  readonly fieldErrors?: Record<string, string[]>

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function sendJson(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(body))
}

export function sendError(res: VercelResponse, error: unknown): void {
  if (error instanceof HttpError) {
    sendJson(res, error.status, {
      error: error.message,
      message: error.message,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    })
    return
  }
  // Unknown failure: never leak internals to the client.
  console.error('[api] unhandled error', error instanceof Error ? error.message : error)
  sendJson(res, 500, {
    error: 'internal_error',
    message: 'We’re temporarily unable to process this request. Please try again shortly.',
  })
}

export function requireMethod(req: VercelRequest, res: VercelResponse, method: string): boolean {
  if (req.method === method) return true
  res.setHeader('Allow', method)
  sendJson(res, 405, { error: 'method_not_allowed', message: `Use ${method}.` })
  return false
}

/**
 * Parses a JSON body, enforcing a size ceiling. Vercel usually pre-parses
 * `req.body`; when it is a string or missing we read the stream ourselves.
 */
export async function readJsonBody(req: VercelRequest, maxBytes = MAX_BODY_BYTES): Promise<unknown> {
  if (req.body && typeof req.body === 'object') {
    // Vercel pre-parsed the body; still enforce the ceiling.
    if (Buffer.byteLength(JSON.stringify(req.body)) > maxBytes) {
      throw new HttpError(413, 'Request body too large.')
    }
    return req.body
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body) > maxBytes) throw new HttpError(413, 'Request body too large.')
    return safeParse(req.body)
  }

  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req as AsyncIterable<Buffer | string>) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : chunk
    size += buffer.length
    if (size > maxBytes) throw new HttpError(413, 'Request body too large.')
    chunks.push(buffer)
  }
  if (size === 0) return {}
  return safeParse(Buffer.concat(chunks).toString('utf8'))
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, 'Request body is not valid JSON.')
  }
}

/**
 * Best-effort client IP for rate limiting. Prefers `x-real-ip`, which Vercel's
 * edge sets to the true client address; `x-forwarded-for` is client-appendable
 * and only a fallback.
 */
export function clientIp(req: VercelRequest): string {
  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim()

  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim() || 'unknown'
  if (Array.isArray(forwarded)) return forwarded[0] ?? 'unknown'
  return req.socket?.remoteAddress ?? 'unknown'
}
