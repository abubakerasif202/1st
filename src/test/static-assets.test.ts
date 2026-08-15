import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'
import imageManifest from '../data/imageManifest.json'
import vercelConfig from '../../vercel.json'

// Resolved by Vite at build time, so the test sees what is actually on disk
// without needing filesystem access from the jsdom environment.
const photoFiles = Object.keys(import.meta.glob('/public/images/replacement/*.webp'))
  .map(file => file.replace('/public', ''))
const manifest = imageManifest as Record<string, { width: number; height: number; widths: number[] }>

describe('static production metadata', () => {
  it('uses the scraper-compatible social card', () => {
    expect(html).toContain('/images/replacement/social-card.jpg')
    expect(html).not.toMatch(/\/images\/replacement\/[^"']+\.png/)
  })

  // ResponsiveImage builds its srcset from the manifest, so a stale manifest
  // means 404s in production that nothing else would catch: the page still
  // renders, the browser just quietly fails to fetch the variant it picked.
  it('keeps the responsive image manifest in step with the files on disk', () => {
    const sources = photoFiles.filter(file => !/-\d+\.webp$/.test(file))
    expect(Object.keys(manifest).sort()).toEqual(sources.sort())

    for (const [src, { width, widths }] of Object.entries(manifest)) {
      expect(widths.at(-1)).toBe(width)
      for (const rendered of widths) {
        const file = rendered === width ? src : src.replace(/\.webp$/, `-${rendered}.webp`)
        expect(photoFiles, `${file} is in the manifest but not in public/images/replacement`).toContain(file)
      }
    }
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
