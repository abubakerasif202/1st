// Browser adapters for the lightweight lead forms. All three post to our own
// serverless endpoints, which validate and email via Resend. (The full
// structured freight quote uses src/features/freightQuote/api.ts instead.)

export type FormResult = { ok: boolean; message: string }

const REQUEST_TIMEOUT_MS = 20_000
const submissionError = 'The request could not be sent. Please use the phone or email option below.'

async function postJson(endpoint: string, payload: unknown): Promise<Response> {
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(submissionError)
  } finally {
    globalThis.clearTimeout(timeout)
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string; error?: string }
    return body.message || body.error || submissionError
  } catch {
    return submissionError
  }
}

export async function submitQuoteRequest(payload: Record<string, unknown>): Promise<FormResult> {
  const response = await postJson('/api/enquiry', { ...payload, kind: 'quick-quote' })
  if (!response.ok) throw new Error(await readError(response))
  return { ok: true, message: 'Thanks — your quote request has been received. We’ll be in touch.' }
}

export async function submitContactRequest(payload: Record<string, unknown>): Promise<FormResult> {
  const response = await postJson('/api/enquiry', { ...payload, kind: 'contact' })
  if (!response.ok) throw new Error(await readError(response))
  return { ok: true, message: 'Thanks — your enquiry has been received. We’ll be in touch.' }
}

export async function submitCareersApplication(payload: Record<string, unknown>): Promise<FormResult> {
  const response = await postJson('/api/careers', payload)
  if (!response.ok) throw new Error(await readError(response))
  return {
    ok: true,
    message: 'Thanks — your application has been received. Our team will review it and contact shortlisted applicants.',
  }
}

/** Read a File as a base64 string (no data: prefix) for JSON upload. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.onload = () => {
      const result = String(reader.result)
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.readAsDataURL(file)
  })
}
