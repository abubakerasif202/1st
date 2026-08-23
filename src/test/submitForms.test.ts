import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitContactRequest, submitQuoteRequest } from '../lib/submitForms'

describe('form submission adapter', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

  it('uses the supplied Formspree endpoint by default', async () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', '')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    await expect(submitQuoteRequest({ firstName: 'Alex', email: 'alex@example.com' })).resolves.toMatchObject({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith('https://formspree.io/f/mdenjrnl', expect.objectContaining({
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    }))
    const request = fetchMock.mock.calls[0][1] as RequestInit
    expect(JSON.parse(request.body as string)).toMatchObject({ formType: 'quote', _subject: 'New freight quote request', email: 'alex@example.com' })
  })

  it('reports successful delivery from a configured endpoint', async () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', 'https://forms.example.test/submit')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    await expect(submitContactRequest({ name: 'Alex' })).resolves.toMatchObject({ ok: true, message: expect.stringContaining('enquiry has been received') })
    expect(fetchMock).toHaveBeenCalledWith('https://forms.example.test/submit', expect.any(Object))
  })

  it('throws a customer-safe error when the endpoint rejects the request', async () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', 'https://forms.example.test/submit')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    await expect(submitContactRequest({ name: 'Alex' })).rejects.toThrow(/could not be sent/i)
  })
})
