import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'
import vercelConfig from '../../vercel.json'

describe('static production metadata', () => {
  it('uses the scraper-compatible social card', () => {
    expect(html).toContain('/images/replacement/social-card.jpg')
    expect(html).not.toMatch(/\/images\/replacement\/[^"']+\.png/)
  })

  it('sets baseline browser security headers on every route', () => {
    const allRoutes = vercelConfig.headers.find(({ source }) => source === '/(.*)')
    expect(allRoutes?.headers).toEqual(expect.arrayContaining([
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]))
  })
})
