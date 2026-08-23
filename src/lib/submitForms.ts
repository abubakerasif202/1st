export type FormResult = { ok: boolean; message: string }

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdenjrnl'
const REQUEST_TIMEOUT_MS = 15_000
const submissionError = 'The request could not be sent. Please use the phone or email option below.'

function resolveEndpoint(kind: 'quote' | 'contact' | 'careers'): string {
  if (kind === 'careers') {
    return (import.meta.env.VITE_CAREERS_FORM_ENDPOINT as string | undefined) || FORMSPREE_ENDPOINT
  }
  return FORMSPREE_ENDPOINT
}

async function postForm(kind: 'quote' | 'contact' | 'careers', body: BodyInit, extraHeaders: Record<string, string> = {}): Promise<Response> {
  const endpoint = resolveEndpoint(kind)
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', ...extraHeaders },
      signal: controller.signal,
      body,
    })
  } catch {
    throw new Error(submissionError)
  } finally {
    globalThis.clearTimeout(timeout)
  }
}

async function submitForm(kind: 'quote' | 'contact', payload: Record<string, unknown>): Promise<FormResult> {
  const response = await postForm(kind, JSON.stringify({
    ...payload,
    formType: kind,
    _subject: kind === 'quote' ? 'New freight quote request' : 'New website enquiry',
  }), { 'Content-Type': 'application/json' })
  if (!response.ok) throw new Error(submissionError)
  return { ok: true, message: kind === 'quote' ? 'Thanks — your quote request has been received. We’ll be in touch.' : 'Thanks — your enquiry has been received. We’ll be in touch.' }
}

export const submitQuoteRequest = (payload: Record<string, unknown>) => submitForm('quote', payload)
export const submitContactRequest = (payload: Record<string, unknown>) => submitForm('contact', payload)

// Careers applications are posted as multipart/form-data (not JSON) so the résumé
// and optional cover letter travel as real file attachments. The browser sets the
// multipart boundary automatically — never set Content-Type manually for FormData.
export async function submitCareersApplication(formData: FormData): Promise<FormResult> {
  const response = await postForm('careers', formData)
  if (!response.ok) throw new Error(submissionError)
  return { ok: true, message: 'Thanks — your application has been received. Our team will review it and contact shortlisted applicants.' }
}
