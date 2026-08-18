import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../app/App'
import { PageHero } from '../components/common/PageHero'
import { AnnouncementBar } from '../components/layout/AnnouncementBar'
import { SiteFooter } from '../components/layout/SiteFooter'
import { company } from '../data/company'
import indexHtml from '../../index.html?raw'

afterEach(() => cleanup())

describe('post-merge review regressions', () => {
  it('renders shared branding copy from the company data source', () => {
    const mutableCompany = company as unknown as { tagline: string }
    const originalTagline = mutableCompany.tagline

    try {
      mutableCompany.tagline = 'Single source test tagline'
      window.sessionStorage.clear()
      render(<MemoryRouter><AnnouncementBar/><SiteFooter/></MemoryRouter>)
      expect(screen.getAllByText(/Single source test tagline/)).toHaveLength(2)
    } finally {
      mutableCompany.tagline = originalTagline
    }
  })

  it('marks breadcrumb decoration and the current page correctly', () => {
    render(<MemoryRouter><PageHero eyebrow="Fleet" title="Fleet title" intro="Fleet intro"/></MemoryRouter>)
    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })

    expect(breadcrumb.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(within(breadcrumb).getByText('Fleet')).toHaveAttribute('aria-current', 'page')
  })

  it.each([
    ['/services', 'Same Day and Next Day'],
    ['/fleet', '1-Tonne Vans'],
  ])('uses level-three headings for cards on %s', async (route, cardTitle) => {
    render(<MemoryRouter initialEntries={[route]}><App/></MemoryRouter>)

    expect(await screen.findByRole('heading', { level: 3, name: cardTitle })).toBeInTheDocument()
  })

  it('scrolls and focuses a service reached through a deep link', async () => {
    const scrollIntoView = vi.fn()
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView })

    try {
      render(<MemoryRouter initialEntries={['/services#same-day']}><App/></MemoryRouter>)

      const targetHeading = await screen.findByRole('heading', { name: 'Same Day and Next Day' })
      await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1))
      expect(targetHeading).toHaveFocus()
    } finally {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: originalScrollIntoView })
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
      }
    }
  })

  it('preloads the compact mark the header actually renders, not the full lockup', () => {
    expect(indexHtml).toContain('<link rel="preload" as="image" href="/brand/first-class-express-mark.webp" />')
    expect(indexHtml).not.toContain('rel="preload" as="image" href="/brand/first-class-express-logo')
  })

  it('publishes verified business structured data without inventing an address', async () => {
    render(<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>)
    await screen.findByRole('heading', { level: 1 })

    const script = document.querySelector<HTMLScriptElement>('script[data-business-schema]')
    expect(script).not.toBeNull()
    const schema = JSON.parse(script?.textContent ?? '{}')
    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '1st Class Express',
      foundingDate: '2013',
      telephone: '0431 604 240',
      email: 'enquiry@1stclassexpress.com.au',
    })
    expect(schema).not.toHaveProperty('address')
  })
})
