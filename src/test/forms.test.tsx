import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { ApplicationForm } from '../components/forms/ApplicationForm'
import { ContactForm } from '../components/forms/ContactForm'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'
import { QuoteForm } from '../components/forms/QuoteForm'

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
  it('shows quote validation errors on step 1 and blocks advancing', async () => {
    const { container } = render(<MemoryRouter><QuoteForm/></MemoryRouter>)
    const form = within(container)
    expect(screen.getByRole('form', { name: /Detailed freight quote/i })).toBeInTheDocument()
    expect(form.getByLabelText(/pickup suburb/i)).toBeRequired()
    expect(form.getByRole('heading', { name: 'Collection Details' })).toBeInTheDocument()
    fireEvent.click(form.getByRole('button', { name: /next/i }))
    expect(await form.findByText('Enter pickup suburb or postcode')).toBeInTheDocument()
    expect(form.getByText('Select a preferred date')).toBeInTheDocument()
    expect(form.getByRole('heading', { name: 'Collection Details' })).toBeInTheDocument()
  })

  it('walks the quote wizard through all five steps and shows the review summary plus consent error', async () => {
    const { container } = render(<MemoryRouter><QuoteForm/></MemoryRouter>)
    const form = within(container)

    fireEvent.change(form.getByLabelText(/pickup suburb/i), { target: { value: 'Sydney NSW' } })
    fireEvent.change(form.getByLabelText(/preferred pickup date/i), { target: { value: '2026-09-01' } })
    fireEvent.click(form.getByRole('button', { name: /next/i }))

    expect(await form.findByRole('heading', { name: 'Delivery Details' })).toBeInTheDocument()
    fireEvent.change(form.getByLabelText(/delivery suburb/i), { target: { value: 'Melbourne VIC' } })
    fireEvent.click(form.getByRole('button', { name: /next/i }))

    expect(await form.findByRole('heading', { name: 'Freight Information' })).toBeInTheDocument()
    fireEvent.change(form.getByLabelText(/service type/i), { target: { value: 'Interstate Linehaul' } })
    fireEvent.change(form.getByLabelText(/urgency/i), { target: { value: 'Scheduled' } })
    fireEvent.change(form.getByLabelText(/freight description/i), { target: { value: 'Two pallets of packaged retail goods' } })
    fireEvent.change(form.getByLabelText(/approximate number of items/i), { target: { value: '2 pallets' } })
    fireEvent.click(form.getByRole('button', { name: /next/i }))

    expect(await form.findByRole('heading', { name: 'Contact Details' })).toBeInTheDocument()
    fireEvent.change(form.getByLabelText(/first name/i), { target: { value: 'Jordan' } })
    fireEvent.change(form.getByLabelText(/last name/i), { target: { value: 'Smith' } })
    fireEvent.change(form.getByLabelText(/company name/i), { target: { value: 'Acme Pty Ltd' } })
    fireEvent.change(form.getByLabelText(/email/i), { target: { value: 'jordan@acme.com' } })
    fireEvent.change(form.getByLabelText(/phone/i), { target: { value: '0400000000' } })
    fireEvent.click(form.getByRole('button', { name: /next/i }))

    expect(await form.findByRole('heading', { name: 'Review And Submit' })).toBeInTheDocument()
    expect(form.getByText('Sydney NSW')).toBeInTheDocument()
    expect(form.getByText('Melbourne VIC')).toBeInTheDocument()
    expect(form.getByText('Jordan')).toBeInTheDocument()
    expect(form.getByText('jordan@acme.com')).toBeInTheDocument()

    fireEvent.click(form.getByRole('button', { name: /request my quote/i }))
    expect(await form.findByText('Consent is required to submit')).toBeInTheDocument()
    expect(form.getByRole('heading', { name: 'Review And Submit' })).toBeInTheDocument()

    fireEvent.click(form.getByRole('button', { name: /back/i }))
    expect(await form.findByRole('heading', { name: 'Contact Details' })).toBeInTheDocument()
    expect(form.getByLabelText(/first name/i)).toHaveValue('Jordan')
  })
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
