import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'

/**
 * Schema/resolver boundary cover for the Zod 4 + @hookform/resolvers 5 stack.
 *
 * The rest of the suite asserts *rejection* paths, which stay green even if the
 * resolver is wired up wrongly and nothing can ever submit. These two prove the
 * other half: that a fully valid payload actually crosses the resolver and
 * reaches the submit adapter, and that the honeypot still blocks a filled bot
 * submission. Both are behaviour assertions — neither touches Zod internals, so
 * they survive a future validation-library change.
 */

vi.mock('../lib/submitForms', () => ({
  submitQuoteRequest: vi.fn(async () => ({ ok: true, message: 'Thanks — your quote request has been received.' })),
  submitContactRequest: vi.fn(),
  submitCareersApplication: vi.fn(),
}))

const { submitQuoteRequest } = await import('../lib/submitForms')

// This suite does not enable Vitest's global test hooks, so React Testing
// Library's automatic afterEach cleanup never registers.
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const fillValidQuote = (form: HTMLElement) => {
  fireEvent.change(within(form).getByRole('textbox', { name: 'Name' }), { target: { value: 'Alex Taylor' } })
  fireEvent.change(within(form).getByRole('textbox', { name: 'Email' }), { target: { value: 'alex@example.com' } })
  fireEvent.change(within(form).getByRole('textbox', { name: 'Phone' }), { target: { value: '0400000000' } })
  fireEvent.change(within(form).getByRole('textbox', { name: /Pickup suburb or postcode/i }), { target: { value: 'Sydney 2000' } })
  fireEvent.change(within(form).getByRole('textbox', { name: /Delivery suburb or postcode/i }), { target: { value: 'Melbourne 3000' } })
  fireEvent.change(within(form).getByRole('textbox', { name: /What are you moving/i }), { target: { value: 'Two pallets of packaged goods, forklift access both ends.' } })
}

describe('validation resolver boundary', () => {
  it('lets a complete, consented quote through to the submit adapter', async () => {
    render(<MemoryRouter><QuickQuoteForm/></MemoryRouter>)
    const form = screen.getByRole('form', { name: /Quick freight quote/i })

    fillValidQuote(form)
    fireEvent.click(within(form).getByRole('checkbox'))
    fireEvent.click(within(form).getByRole('button', { name: /Get My Free Quote/i }))

    await waitFor(() => expect(submitQuoteRequest).toHaveBeenCalledTimes(1))
    expect(submitQuoteRequest).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Alex Taylor',
      email: 'alex@example.com',
      pickup: 'Sydney 2000',
      delivery: 'Melbourne 3000',
      consent: true,
    }))
    // The consent literal must not report an error once it is actually ticked.
    expect(within(form).queryByText('Consent is required to submit')).not.toBeInTheDocument()
    expect(await within(form).findByText(/has been received/i)).toBeInTheDocument()
  })

  it('blocks a submission that filled the honeypot field', async () => {
    const { container } = render(<MemoryRouter><QuickQuoteForm/></MemoryRouter>)
    const form = screen.getByRole('form', { name: /Quick freight quote/i })

    fillValidQuote(form)
    fireEvent.click(within(form).getByRole('checkbox'))

    // Only a bot fills this: it is inert and off-screen for real users.
    const honeypot = container.querySelector<HTMLInputElement>('.honeypot input[name="website"]')
    expect(honeypot).not.toBeNull()
    fireEvent.change(honeypot!, { target: { value: 'https://spam.example' } })

    fireEvent.click(within(form).getByRole('button', { name: /Get My Free Quote/i }))

    await waitFor(() => expect(within(form).queryByText(/has been received/i)).not.toBeInTheDocument())
    expect(submitQuoteRequest).not.toHaveBeenCalled()
  })
})
