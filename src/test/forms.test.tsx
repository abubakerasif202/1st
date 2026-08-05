import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ContactForm } from '../components/forms/ContactForm'
import { QuickQuoteForm } from '../components/forms/QuickQuoteForm'
import { QuoteForm } from '../components/forms/QuoteForm'

describe('forms', () => {
  it('shows contact validation errors', async () => { render(<MemoryRouter><ContactForm/></MemoryRouter>); fireEvent.click(screen.getByRole('button', { name: /send enquiry/i })); expect(await screen.findByText('Enter your name')).toBeInTheDocument(); expect(screen.getByText('Enter a valid email')).toBeInTheDocument() })
  it('shows quote validation errors', async () => { render(<MemoryRouter><QuoteForm/></MemoryRouter>); fireEvent.click(screen.getByRole('button', { name: /request my quote/i })); expect(await screen.findByText('Enter your first name')).toBeInTheDocument(); expect(screen.getByText('Consent is required to submit')).toBeInTheDocument() })
  it('shows quick quote validation errors', async () => {
    render(<MemoryRouter><QuickQuoteForm/></MemoryRouter>)
    const form = screen.getByRole('form', { name: /Quick freight quote/i })
    fireEvent.click(within(form).getByRole('button', { name: /Get My Free Quote/i }))
    expect(await within(form).findByText('Enter your name')).toBeInTheDocument()
    expect(within(form).getByText('Enter pickup suburb or postcode')).toBeInTheDocument()
    expect(within(form).getByText('Consent is required to submit')).toBeInTheDocument()
  })
})
