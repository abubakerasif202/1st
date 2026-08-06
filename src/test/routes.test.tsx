import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../app/App'

function renderRoute(route: string) {
  window.sessionStorage.setItem('intro-seen', 'true')
  render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
}

const routeRenderTimeout = 15_000

describe('Lovable-aligned primary routes', () => {
  afterEach(() => cleanup())

  it.each([
    ['/', /Freight Moved First Class/i],
    ['/about', /Australian Owned\. Freight Focused\./i],
    ['/services', /Transport Built Around Your Freight/i],
    ['/fleet', /The Right Vehicle For The Freight/i],
    ['/service-areas', /Metropolitan, Regional And Interstate/i],
    ['/quote', /Tell Us What Needs Moving/i],
    ['/contact', /Let's Get Your Freight Moving/i],
    ['/careers', /Drive Your Career Forward/i],
  ])('renders %s with the reference heading', async (route, heading) => {
    renderRoute(route)
    expect(await screen.findByRole('heading', { level: 1, name: heading }, { timeout: routeRenderTimeout })).toBeInTheDocument()
  }, routeRenderTimeout + 5_000)

  it.each([
    ['/about-us', /Australian Owned\. Freight Focused\./i],
    ['/our-services', /Transport Built Around Your Freight/i],
    ['/our-fleet', /The Right Vehicle For The Freight/i],
    ['/book-now', /Tell Us What Needs Moving/i],
  ])('keeps legacy route %s working', async (route, heading) => {
    renderRoute(route)
    expect(await screen.findByRole('heading', { level: 1, name: heading }, { timeout: routeRenderTimeout })).toBeInTheDocument()
  }, routeRenderTimeout + 5_000)

  it('uses the Lovable navigation and quote destination', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { level: 1, name: /Freight Moved First Class/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Services' })[0]).toHaveAttribute('href', '/services')
    expect(screen.getAllByRole('link', { name: 'Our Fleet' })[0]).toHaveAttribute('href', '/fleet')
    expect(screen.getAllByRole('link', { name: 'Request a Quote' })[0]).toHaveAttribute('href', '/quote')
  })

  it('shows all eight reference transport services on the homepage', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { name: 'Same Day and Next Day' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'After-Hours and Weekend Transport' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interstate Linehaul' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dangerous Goods Transport' })).toBeInTheDocument()
  })

  it('publishes the supplied contact number', async () => {
    renderRoute('/contact')
    expect((await screen.findAllByRole('link', { name: '0431 604 240' }))[0]).toHaveAttribute('href', 'tel:0431604240')
  })

  it('renders the branded 404 route as noindex', async () => {
    renderRoute('/missing')
    expect(await screen.findByText(/Wrong turn/i, {}, { timeout: routeRenderTimeout })).toBeInTheDocument()
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument()
  })
})
