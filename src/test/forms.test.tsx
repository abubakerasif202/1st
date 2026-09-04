import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { ApplicationForm } from '../components/forms/ApplicationForm'
import { ContactForm } from '../components/forms/ContactForm'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'

// This suite does not enable Vitest's global test hooks, so React Testing
// Library's automatic afterEach cleanup never registers. Without it, DOM
// (and duplicate element ids) from earlier tests leaks into later ones —
// clean up explicitly so each test starts from an empty document body.
afterEach(() => cleanup())

describe('forms', () => {
  it('names the contact form and exposes required fields to assistive technology', async () => {
    render(<MemoryRouter><ContactForm/></MemoryRouter>)
    const form = screen.getByRole('form', { name: /Contact enquiry/i })
    expect(within(form).getByRole('textbox', { name: 'Name' })).toBeRequired()
    expect(within(form).getByRole('textbox', { name: 'Email' })).toBeRequired()
    fireEvent.click(within(form).getByRole('button', { name: /send enquiry/i }))
    expect(await within(form).findByText('Enter your name')).toBeInTheDocument()
    expect(within(form).getByText('Enter a valid email')).toBeInTheDocument()
  })
  // The full /quote wizard is covered by freightQuote.wizard.test.tsx and the
  // e2e/freight-quote.spec.ts journey; QuickQuoteForm is the homepage teaser.
  it('shows quick quote validation errors', async () => {
    render(<MemoryRouter><QuickQuoteForm/></MemoryRouter>)
    const form = screen.getByRole('form', { name: /Quick freight quote/i })
    expect(within(form).getByRole('textbox', { name: 'Name' })).toBeRequired()
    expect(within(form).getByRole('textbox', { name: /Pickup suburb or postcode/i })).toBeRequired()
    expect(within(form).getByRole('checkbox')).toBeRequired()
    fireEvent.click(within(form).getByRole('button', { name: /Get My Free Quote/i }))
    expect(await within(form).findByText('Enter your name')).toBeInTheDocument()
    expect(within(form).getByText('Enter pickup suburb or postcode')).toBeInTheDocument()
    expect(within(form).getByText('Consent is required to submit')).toBeInTheDocument()
  })
  it('keeps the first-stage driver application focused on essential screening', async () => {
    render(<MemoryRouter><ApplicationForm/></MemoryRouter>)
    const form = screen.getByRole('form', { name: /Driver application/i })

    expect(within(form).getByRole('textbox', { name: 'First name' })).toBeRequired()
    expect(within(form).getByRole('combobox', { name: /Current licence class/i })).toBeRequired()
    expect(within(form).getByLabelText(/Résumé/i)).toBeRequired()
    expect(within(form).queryByLabelText(/Brief employment history/i)).not.toBeInTheDocument()
    expect(within(form).queryByLabelText(/Dangerous-goods/i)).not.toBeInTheDocument()
    expect(within(form).queryByLabelText(/Cover letter/i)).not.toBeInTheDocument()

    fireEvent.click(within(form).getByRole('button', { name: /submit application/i }))
    expect(await within(form).findByText('Enter your first name')).toBeInTheDocument()
    expect(within(form).getByText('Attach your résumé (PDF, DOC or DOCX)')).toBeInTheDocument()
    expect(within(form).getByText('Privacy acknowledgement is required')).toBeInTheDocument()
  })
  it('preselects the role from the URL query string', async () => { render(<MemoryRouter initialEntries={['/careers?role=HC%20Driver']}><ApplicationForm/></MemoryRouter>); expect(await screen.findByDisplayValue('HC Driver')).toBeInTheDocument() })
})
