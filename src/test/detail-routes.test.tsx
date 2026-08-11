// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../app/App'
import { fleet } from '../data/fleet'
import { interstateRoutes } from '../data/interstateRoutes'
import routeSeo from '../data/routeSeo.json'
import sitemapXml from '../../public/sitemap.xml?raw'
import vercelJson from '../../vercel.json?raw'
import { serviceRegions } from '../data/serviceRegions'
import { services } from '../data/services'

const timeout = 15_000

function renderRoute(route: string) {
  window.sessionStorage.setItem('intro-seen', 'true')
  render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
}

const publicRoutes = Object.entries(routeSeo as Record<string, { path: string; title: string; description: string }>)
  .filter(([name]) => name !== 'notFound')
  .map(([, route]) => route)

describe('dynamic detail routes', () => {
  afterEach(() => cleanup())

  it.each(services.map(service => [service.slug, service.title] as const))(
    'renders /services/%s',
    async (slug, title) => {
      renderRoute(`/services/${slug}`)
      expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout })).toBeInTheDocument()
    }, timeout + 5_000)

  it.each(fleet.map(vehicle => [vehicle.slug, vehicle.title] as const))(
    'renders /fleet/%s',
    async (slug, title) => {
      renderRoute(`/fleet/${slug}`)
      expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout })).toBeInTheDocument()
    }, timeout + 5_000)

  it.each(interstateRoutes.map(route => [route.slug, route.title] as const))(
    'renders /service-areas/interstate/%s',
    async (slug, title) => {
      renderRoute(`/service-areas/interstate/${slug}`)
      expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout })).toBeInTheDocument()
    }, timeout + 5_000)

  it.each(serviceRegions.map(region => [region.slug, region.title] as const))(
    'renders /service-areas/%s',
    async (slug, title) => {
      renderRoute(`/service-areas/${slug}`)
      expect(await screen.findByRole('heading', { level: 1, name: title }, { timeout })).toBeInTheDocument()
    }, timeout + 5_000)

  it.each([
    '/services/not-a-service',
    '/fleet/not-a-vehicle',
    '/service-areas/not-a-region',
    '/service-areas/interstate/not-a-route',
  ])('serves the 404 page for the unknown route %s', async route => {
    renderRoute(route)
    expect(await screen.findByText(/Wrong turn/i, {}, { timeout })).toBeInTheDocument()
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument()
  }, timeout + 5_000)

  it('gives a detail page exactly one breadcrumb trail ending on the current page', async () => {
    renderRoute('/services/dangerous-goods')
    await screen.findByRole('heading', { level: 1, name: 'Dangerous Goods Transport' }, { timeout })

    const trails = screen.getAllByRole('navigation', { name: /breadcrumb/i })
    expect(trails).toHaveLength(1)

    const trail = within(trails[0])
    expect(trail.getByRole('link', { name: /Home/ })).toHaveAttribute('href', '/')
    expect(trail.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(trail.getByText('Dangerous Goods Transport')).toHaveAttribute('aria-current', 'page')
  }, timeout + 5_000)
})

// The original defect: routeSeo.json, the sitemap and vercel.json all advertised
// detail URLs that no <Route> matched, so the prerenderer happily wrote the 404
// body into an indexable document. These lock the three files to each other and
// to the router.
describe('prerender route contract', () => {
  afterEach(() => cleanup())

  it.each(publicRoutes.map(route => [route.path, route.title] as const))(
    'resolves %s to a real page rather than the 404 body',
    async path => {
      renderRoute(path)
      await screen.findByRole('heading', { level: 1 }, { timeout })
      expect(screen.queryByText(/Wrong turn/i)).not.toBeInTheDocument()
    }, timeout + 5_000)

  it('keeps sitemap.xml in step with routeSeo.json', () => {
    const sitemapPaths = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname)
    expect(sitemapPaths.sort()).toEqual(publicRoutes.map(route => route.path).sort())
  })

  it('keeps vercel.json rewrites in step with routeSeo.json', () => {
    const vercel = JSON.parse(vercelJson) as { rewrites: { source: string }[] }
    const expected = publicRoutes.map(route => route.path).filter(path => path !== '/')
    expect(vercel.rewrites.map(rewrite => rewrite.source).sort()).toEqual(expected.sort())
    // A catch-all rewrite would turn every unknown URL into a soft 404.
    expect(vercel.rewrites.some(({ source }) => source.includes('*'))).toBe(false)
  })

  it('gives every service, vehicle, region and corridor a curated routeSeo entry', () => {
    const paths = new Set(publicRoutes.map(route => route.path))
    services.forEach(service => expect(paths).toContain(`/services/${service.slug}`))
    fleet.forEach(vehicle => expect(paths).toContain(`/fleet/${vehicle.slug}`))
    serviceRegions.forEach(region => expect(paths).toContain(`/service-areas/${region.slug}`))
    interstateRoutes.forEach(route => expect(paths).toContain(`/service-areas/interstate/${route.slug}`))
  })
})
