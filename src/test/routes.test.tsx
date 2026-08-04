import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../app/App'

async function renderRoute(route: string) {
  render(<MemoryRouter initialEntries={[route]}><App/></MemoryRouter>)
}

describe('primary routes', () => {
  beforeEach(() => sessionStorage.setItem('intro-seen', 'true'))
  afterEach(() => cleanup())
  it.each([
    ['/', /Moving Your Freight/i], ['/about-us', /Transport experience/i], ['/our-services', /Freight services shaped/i], ['/our-fleet', /right scale/i], ['/book-now', /Give us the freight details/i], ['/contact', /Talk to the transport team/i],
  ])('renders %s', async (route, heading) => { await renderRoute(route); expect(await screen.findByRole('heading', { level: 1, name: heading }, { timeout: 5000 })).toBeInTheDocument() })
  it('renders the branded 404 route', async () => { await renderRoute('/missing'); expect(await screen.findByText(/Wrong turn/i, {}, { timeout: 5000 })).toBeInTheDocument() })
  it('marks the active navigation link', async () => { await renderRoute('/our-services'); const links = await screen.findAllByRole('link', { name: 'Our Services' }); expect(links.some(link => link.classList.contains('active'))).toBe(true) })
})
