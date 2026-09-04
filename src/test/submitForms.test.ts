import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitCareersApplication, submitContactRequest, submitQuoteRequest } from '../lib/submitForms'

describe('form submission adapters', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts the quick quote to /api/enquiry with kind "quick-quote"', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      submitQuoteRequest({ name: 'Alex', email: 'alex@example.com', pickup: 'Sydney', delivery: 'Melbourne' }),
    ).resolves.toMatchObject({ ok: true, message: expect.stringContaining('quote request has been received') })

    expect(fetchMock).toHaveBeenCalledWith('/api/enquiry', expect.objectContaining({ method: 'POST' }))
    const [, init] = fetchMock.mock.calls[0]
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      kind: 'quick-quote',
      email: 'alex@example.com',
    })
  })

  it('posts the contact form to /api/enquiry with kind "contact"', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(submitContactRequest({ name: 'Alex' })).resolves.toMatchObject({
      ok: true,
      message: expect.stringContaining('enquiry has been received'),
    })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/enquiry')
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({ kind: 'contact' })
  })

  it('posts the careers application to /api/careers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await expect(submitCareersApplication({ firstName: 'Alex' })).resolves.toMatchObject({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith('/api/careers', expect.objectContaining({ method: 'POST' }))
  })

  it('surfaces the server error message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: 'Some details need attention.' }) }),
    )
    await expect(submitContactRequest({ name: 'Alex' })).rejects.toThrow('Some details need attention.')
  })

  it('throws a customer-safe error when the network fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down')),
    )
    await expect(submitQuoteRequest({ name: 'Alex' })).rejects.toThrow(/could not be sent/i)
  })
})
