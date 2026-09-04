// Thin wrapper over Resend's REST API. One POST per message, no SDK.
//
// A missing key or a Resend error never throws — the caller decides whether an
// email failure is fatal. For the freight quote it is not (the quote is saved);
// for the enquiry / careers forms there is no store, so the handler surfaces a
// failure to the user.

import { env } from './env.js'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface EmailResult {
  sent: boolean
  skippedReason?: string
  error?: string
}

export interface MailAttachment {
  filename: string
  /** base64-encoded file content */
  content: string
  contentType?: string
}

export interface MailPayload {
  from: string
  to: string[]
  subject: string
  text: string
  replyTo?: string
  attachments?: MailAttachment[]
}

/** Strip control characters (CR/LF included) so user text can't tamper with headers. */
export function cleanHeader(value: string): string {
  let out = ''
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0
    out += code < 0x20 || code === 0x7f ? ' ' : ch
  }
  return out.replace(/ {2,}/g, ' ').trim()
}

export async function sendViaResend(payload: MailPayload): Promise<EmailResult> {
  if (process.env.VITEST) return { sent: false, skippedReason: 'test' }
  const key = env.resendApiKey()
  if (!key) return { sent: false, skippedReason: 'RESEND_API_KEY not configured' }

  const body: Record<string, unknown> = {
    from: payload.from,
    to: payload.to,
    subject: cleanHeader(payload.subject),
    text: payload.text,
  }
  if (payload.replyTo) body.reply_to = payload.replyTo
  if (payload.attachments?.length) {
    body.attachments = payload.attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
      ...(a.contentType ? { content_type: a.contentType } : {}),
    }))
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const errBody = await response.text()
      return { sent: false, error: `Resend ${response.status}: ${errBody.slice(0, 200)}` }
    }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: error instanceof Error ? error.message : 'network error' }
  }
}
