import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../app/App'
import { company } from '../data/company'

function renderRoute(route: string) {
  render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
}

const routeRenderTimeout = 15_000

describe('Lovable-aligned primary routes', () => {
  afterEach(() => cleanup())

  it.each([
    ['/', /Reliable Freight\. Professional Drivers\. Australia-Wide\./i],
    ['/about', /Australian Owned\. Freight Focused\./i],
    ['/services', /Transport Built Around Your Freight/i],
    ['/fleet', /The Right Vehicle For The Freight/i],
    ['/service-areas', /Metropolitan, Regional And Interstate/i],
    ['/quote', /Tell Us What Needs Moving/i],
    ['/contact', /Let's Get Your Freight Moving/i],
    ['/careers', /Register Your Interest In Driving With Us/i],
    ['/driver-handbook', /Driving with 1st Class Express/i],
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
    expect(await screen.findByRole('heading', { level: 1, name: /Reliable Freight\. Professional Drivers\. Australia-Wide\./i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Services' })[0]).toHaveAttribute('href', '/services')
    expect(screen.getAllByRole('link', { name: 'Our Fleet' })[0]).toHaveAttribute('href', '/fleet')
    expect(screen.getAllByRole('link', { name: 'Request a Quote' })[0]).toHaveAttribute('href', '/quote')
  })

  it('gives visitors a direct premium quote journey backed by verified facts', async () => {
    renderRoute('/')

    expect(await screen.findByRole('link', { name: /Get a Free Quote/i })).toHaveAttribute('href', '#quick-quote')
    expect(screen.getByRole('link', { name: /Explore Our Fleet/i })).toHaveAttribute('href', '/fleet')
    expect(screen.getByRole('form', { name: /Quick freight quote/i })).toBeInTheDocument()
    expect(screen.getByText(/Established in 2013/i)).toBeInTheDocument()
  })

  it('delivers a dimensioned WebP hero asset', async () => {
    renderRoute('/')
    const hero = await screen.findByRole('img', { name: /branded prime mover.*interstate freight routes/i })

    expect(hero).toHaveAttribute('src', '/images/replacement/prime-mover-network-hero.webp')
    expect(hero).toHaveAttribute('width', '1672')
    expect(hero).toHaveAttribute('height', '941')
  })

  it('shows all eight reference transport services on the homepage', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { name: 'Same Day and Next Day' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'After-Hours and Weekend Transport' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interstate Linehaul' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dangerous Goods Transport' })).toBeInTheDocument()
  })

  it('explains the verified operating model on the About page', async () => {
    renderRoute('/about')
    expect(await screen.findByRole('heading', { name: /Built Around Freight, Drivers And Operations/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Professional Drivers Who Represent The Customer Well/i })).toBeInTheDocument()
    expect(screen.getByText(/Monthly KPI reporting/i)).toBeInTheDocument()
  })

  it('organises service capability around delivery, people and operations', async () => {
    renderRoute('/services')
    expect(await screen.findByRole('heading', { name: /Freight Delivery/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Driver Support/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Fleet And Operations/i })).toBeInTheDocument()
  })

  it.each(['/about', '/services', '/fleet', '/service-areas', '/contact', '/careers'])('serves optimized branded imagery on %s', async route => {
    renderRoute(route)
    await screen.findByRole('heading', { level: 1 })
    const brandedImages = Array.from(document.querySelectorAll<HTMLImageElement>('main img[src*="/images/replacement/"]'))
    expect(brandedImages.length).toBeGreaterThan(0)
    brandedImages.forEach(image => expect(image.getAttribute('src')).toMatch(/\.webp$/))
  })

  it('uses a unique branded image for every fleet gallery tile', async () => {
    renderRoute('/fleet')
    await screen.findByRole('heading', { name: /On The Road And In The Yard/i })
    const sources = Array.from(document.querySelectorAll<HTMLImageElement>('.fleet-gallery img')).map(image => image.getAttribute('src'))
    expect(new Set(sources).size).toBe(sources.length)
  })

  it('publishes the supplied contact number', async () => {
    renderRoute('/contact')
    expect((await screen.findAllByRole('link', { name: '0431 604 240' }))[0]).toHaveAttribute('href', 'tel:0431604240')
  })

  it('builds the driver handbook from the same data as the public pages', async () => {
    renderRoute('/driver-handbook')
    expect(await screen.findByRole('heading', { level: 1, name: /Driving with 1st Class Express/i }, { timeout: routeRenderTimeout })).toBeInTheDocument()
    // Every driver role, fleet vehicle and service is reproduced in the document.
    expect(screen.getByRole('heading', { level: 3, name: 'Interstate Heavy Vehicle Driver' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'B-Double Configurations' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Dangerous Goods Transport' })).toBeInTheDocument()
    const doc = within(screen.getByRole('article', { name: 'Driver Handbook document' }))
    expect(doc.getByRole('link', { name: company.phonePrimary })).toHaveAttribute('href', 'tel:0431604240')
  }, routeRenderTimeout + 5_000)

  it('offers the handbook from the careers page', async () => {
    renderRoute('/careers')
    expect(await screen.findByRole('link', { name: /Read the Driver Handbook/i }, { timeout: routeRenderTimeout })).toHaveAttribute('href', '/driver-handbook')
  }, routeRenderTimeout + 5_000)

  it('renders the branded 404 route as noindex', async () => {
    renderRoute('/missing')
    expect(await screen.findByText(/Wrong turn/i, {}, { timeout: routeRenderTimeout })).toBeInTheDocument()
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument()
  })
})
