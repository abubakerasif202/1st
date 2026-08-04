export type FormResult = { ok: boolean; message: string }

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgqqqld'
const REQUEST_TIMEOUT_MS = 15_000
const submissionError = 'The request could not be sent. Please use the phone or email option below.'

async function submitForm(kind: 'quote' | 'contact', payload: Record<string, unknown>): Promise<FormResult> {
  const endpoint = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || FORMSPREE_ENDPOINT
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        ...payload,
        formType: kind,
        _subject: kind === 'quote' ? 'New freight quote request' : 'New website enquiry',
      }),
    })
  } catch {
    throw new Error(submissionError)
  } finally {
    globalThis.clearTimeout(timeout)
  }
  if (!response.ok) throw new Error(submissionError)
  return { ok: true, message: kind === 'quote' ? 'Thanks — your quote request has been received. We’ll be in touch.' : 'Thanks — your enquiry has been received. We’ll be in touch.' }
}

export const submitQuoteRequest = (payload: Record<string, unknown>) => submitForm('quote', payload)
export const submitContactRequest = (payload: Record<string, unknown>) => submitForm('contact', payload)
