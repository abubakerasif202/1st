import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../app/App'

async function renderRoute(route: string) {
  render(<MemoryRouter initialEntries={[route]}><App/></MemoryRouter>)
}

const routeRenderTimeout = 15000

describe('primary routes', () => {
  beforeEach(() => sessionStorage.setItem('intro-seen', 'true'))
  afterEach(() => cleanup())
  it.each([
    ['/', /Reliable Freight\. Professional Drivers\. Australia-Wide\./i], ['/about-us', /Professional transport, delivery and fleet solutions/i], ['/our-services', /Our World-Class Services/i], ['/our-fleet', /Our World-Class Fleet/i], ['/book-now', /Give us the freight details/i], ['/contact', /Talk to the transport team/i],
  ])('renders %s', async (route, heading) => { await renderRoute(route); expect(await screen.findByRole('heading', { level: 1, name: heading }, { timeout: routeRenderTimeout })).toBeInTheDocument() }, routeRenderTimeout + 5000)
  it('leads the homepage with the approved freight promise', async () => {
    await renderRoute('/')
    expect(await screen.findByRole('heading', { level: 1, name: /Reliable Freight\. Professional Drivers\. Australia-Wide\./i }, { timeout: 1500 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Get a Free Quote/i })).toHaveAttribute('href', '#quick-quote')
    expect(screen.getByRole('link', { name: /Explore Our Fleet/i })).toHaveAttribute('href', '/our-fleet')
  })
  it('offers a streamlined quote form on the homepage', async () => {
    await renderRoute('/')
    expect(await screen.findByRole('form', { name: /Quick freight quote/i }, { timeout: 1500 })).toBeInTheDocument()
    expect(screen.getByLabelText(/Pickup suburb or postcode/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Delivery suburb or postcode/i)).toBeInTheDocument()
  })
  it('renders the branded 404 route', async () => { await renderRoute('/missing'); expect(await screen.findByText(/Wrong turn/i, {}, { timeout: routeRenderTimeout })).toBeInTheDocument() })
  it('marks the branded 404 route as noindex', async () => { await renderRoute('/missing'); expect(await screen.findByText(/Wrong turn/i, {}, { timeout: 5000 })).toBeInTheDocument(); expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow'); expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument() })
  it('gives repeated service links descriptive accessible names', async () => { await renderRoute('/'); expect(await screen.findByRole('link', { name: /Learn more about Same Day \/ Next Day/i }, { timeout: routeRenderTimeout })).toBeInTheDocument() })
  it('marks the active navigation link', async () => { await renderRoute('/our-services'); const links = await screen.findAllByRole('link', { name: 'Our Services' }); expect(links.some(link => link.classList.contains('active'))).toBe(true) })
})
