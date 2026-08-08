import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'

describe('static production metadata', () => {
  it('uses the optimized social image format', () => {
    expect(html).toContain('/images/replacement/prime-mover-hero-branded.webp')
    expect(html).not.toMatch(/\/images\/replacement\/[^"']+\.png/)
  })
})
