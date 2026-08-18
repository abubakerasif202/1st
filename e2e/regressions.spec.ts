import { expect, test } from '@playwright/test'
import { contrastRatio } from './contrast'

/**
 * Regression cover for the homepage contrast / surface-role failures.
 *
 * All four P0 defects had the same shape: a `.hybrid-*` container painted a
 * ground the theme.css role system did not know about, so its descendants kept
 * the roles of the *opposite* surface. The hero and operations CTAs resolved
 * --btn-outline-fg to --ink on an --ink ground (1.00:1 — an empty outline), and
 * the cream coverage section carried a "--light" (meaning: light text) heading
 * modifier. These assert the computed result in the browser, so re-introducing
 * a hybrid class without registering its surface fails here, not in review.
 */

// [ description, url, selector, minimum ratio ]
const CONTRAST_CASES = [
  ['hero outline CTA (dark ground)', '/', '.hybrid-hero .lovable-btn--secondary', 4.5],
  ['hero kicker (dark ground)', '/', '.hybrid-hero .lovable-kicker', 4.5],
  ['hero proof-rail copy (dark ground)', '/', '.hybrid-hero__rail article span', 4.5],
  ['operations CTA (dark ground)', '/', '.hybrid-operations .lovable-btn--secondary', 4.5],
  ['operations kicker (dark ground)', '/', '.hybrid-operations .lovable-kicker', 4.5],
  ['capability panel kicker (dark panel, white section)', '/', '.hybrid-capability-panel .lovable-kicker', 4.5],
  // Large display type only needs 3:1, but a surface-role slip shows up as ~1:1.
  ['coverage heading (cream ground)', '/', '#coverage-title', 3],
  ['coverage inline CTA (cream ground)', '/', '.hybrid-coverage .hybrid-section-heading a', 4.5],
  ['capability inline CTA (white ground)', '/', '.hybrid-capability .hybrid-section-heading a', 4.5],
  ['coverage card copy (white card)', '/', '.hybrid-coverage-grid span', 4.5],
  ['"Prefer to speak?" label (white ground)', '/', '.hybrid-quote-phone small', 4.5],
] as const

for (const [label, url, selector, minimum] of CONTRAST_CASES) {
  test(`contrast: ${label}`, async ({ page }) => {
    await page.goto(url)
    await expect(page.locator(selector).first()).toBeVisible()
    const ratio = await contrastRatio(page, selector)
    expect(ratio, `${selector} measured ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(minimum)
  })
}

test('no homepage text has collapsed onto its own background', async ({ page }) => {
  await page.goto('/')
  // A deliberately blunt sweep: anything at or below 1.5:1 is invisible or all
  // but invisible, whatever the surface. This is the check that would have
  // caught "Explore Our Fleet" rendering as an empty outlined box.
  const invisible = await page.evaluate(() => {
    const parse = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number)
    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((channel) => {
        const c = channel / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const over = (top: number[], bottom: number[], alpha: number) =>
      top.map((channel, i) => channel * alpha + bottom[i] * (1 - alpha))
    // Semi-transparent grounds must be composited, not skipped: the sticky
    // header paints rgba(15,21,27,.97), and treating that as "not a background"
    // compared its white nav links against <body> and reported a false 1.32:1.
    const backgroundOf = (start: Element) => {
      const layers: Array<[number[], number]> = []
      for (let node: Element | null = start; node; node = node.parentElement) {
        const parts = parse(getComputedStyle(node).backgroundColor)
        const alpha = parts[3] ?? 1
        if (alpha > 0) {
          layers.push([parts.slice(0, 3), alpha])
          if (alpha === 1) break
        }
      }
      return layers.reduceRight<number[]>((below, [colour, alpha]) => over(colour, below, alpha), [255, 255, 255])
    }
    const offenders: string[] = []
    document.querySelectorAll<HTMLElement>('a, button, h1, h2, h3, p, span, strong, small, li').forEach((element) => {
      const text = element.textContent?.trim()
      if (!text) return
      // Only elements that paint their own text node.
      if (!Array.from(element.childNodes).some((node) => node.nodeType === 3 && node.textContent?.trim())) return
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const style = getComputedStyle(element)
      if (style.visibility === 'hidden' || style.opacity === '0') return
      // Outlined display type paints a stroke, not a fill, so a colour-only
      // comparison cannot judge it. Excluded explicitly rather than silently.
      if (parseFloat(style.webkitTextStrokeWidth || '0') > 0) return
      const colour = parse(style.color)
      if ((colour[3] ?? 1) === 0) return
      const background = backgroundOf(element)
      const a = luminance(colour.slice(0, 3))
      const b = luminance(background)
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      if (ratio <= 1.5) {
        offenders.push(`${element.tagName.toLowerCase()}.${element.className || '(none)'}: "${text.slice(0, 40)}" ${ratio.toFixed(2)}:1`)
      }
    })
    return offenders
  })
  expect(invisible).toEqual([])
})

/* -------------------------------------------------------------------------- */

const TOUCH_TARGET_CASES = [
  ['/quote', '.check-field', 'consent control'],
  ['/quote', '.quote-stepper__btn', 'quote step buttons'],
  ['/', '.hybrid-section-heading > div:last-child a', 'inline conversion links'],
] as const

for (const [url, selector, label] of TOUCH_TARGET_CASES) {
  test(`touch target: ${label} clears 44px at 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(url)
    if (url === '/quote' && selector === '.check-field') await advanceToReviewStep(page)
    const undersized = await page.locator(selector).evaluateAll((elements) =>
      elements
        .map((element) => ({ box: element.getBoundingClientRect(), text: element.textContent?.trim() ?? '' }))
        .filter(({ box }) => box.width > 0 && box.height > 0)
        .filter(({ box }) => box.width < 44 || box.height < 44)
        .map(({ box, text }) => `${text.slice(0, 30)} ${Math.round(box.width)}x${Math.round(box.height)}`),
    )
    expect(undersized, `${selector} below 44px`).toEqual([])
  })
}

test('the mobile drawer promotes the quote action as a button, not a nav row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const cta = page.getByRole('dialog').getByRole('link', { name: /Request a Quote/i })
  await expect(cta).toBeVisible()
  await expect(cta).toHaveClass(/lovable-btn--primary/)
  const box = await cta.boundingBox()
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44)
  // It must read as the primary action, not inherit the plain nav-link ground.
  const background = await cta.evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(background).not.toBe('rgba(0, 0, 0, 0)')
})

/* -------------------------------------------------------------------------- */

const VIEWPORTS = [
  { width: 390, height: 844, name: 'mobile' },
  { width: 834, height: 1112, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' },
] as const

const ROUTES = ['/', '/services', '/fleet', '/service-areas', '/quote', '/contact', '/service-areas/interstate/sydney-melbourne'] as const

for (const viewport of VIEWPORTS) {
  test(`no horizontal overflow at ${viewport.width}px (${viewport.name})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    for (const route of ROUTES) {
      await page.goto(route)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${route} overflows at ${viewport.width}px`).toBeLessThanOrEqual(1)
    }
  })
}

/* -------------------------------------------------------------------------- */

const HERO_CTA_ROUTES = [
  '/services',
  '/fleet',
  '/service-areas',
  '/services/same-day',
  '/fleet/b-doubles',
  '/service-areas/sydney',
  '/service-areas/interstate/sydney-melbourne',
] as const

test('high-intent interior heroes render the shared quote CTA', async ({ page }) => {
  for (const route of HERO_CTA_ROUTES) {
    await page.goto(route)
    const cta = page.locator('.page-hero__actions a')
    await expect(cta, `${route} hero CTA`).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/quote')
    await expect(cta).toHaveText(/Request a Quote/)
  }
})

test('the quote page does not point its own hero back at itself', async ({ page }) => {
  await page.goto('/quote')
  await expect(page.locator('.page-hero__actions')).toHaveCount(0)
})

/* -------------------------------------------------------------------------- */

test('representative controls expose a visible focus ring on both grounds', async ({ page }) => {
  const cases = [
    ['/', '.hybrid-hero .lovable-btn--secondary'],
    ['/', '.hybrid-coverage .hybrid-section-heading a'],
    ['/quote', '.quote-form input'],
    ['/quote', '.quote-form-nav .btn-primary'],
  ] as const

  for (const [url, selector] of cases) {
    await page.goto(url)
    const target = page.locator(selector).first()
    await target.focus()
    const ring = await target.evaluate((element) => {
      const style = getComputedStyle(element)
      return { width: parseFloat(style.outlineWidth), style: style.outlineStyle, colour: style.outlineColor }
    })
    expect(ring.style, `${selector} outline-style`).not.toBe('none')
    expect(ring.width, `${selector} outline-width`).toBeGreaterThanOrEqual(2)
    expect(ring.colour, `${selector} outline-color`).not.toBe('rgba(0, 0, 0, 0)')
  }
})

test('the form honeypot is neither focusable nor announced', async ({ page }) => {
  await page.goto('/')
  const honeypot = page.locator('.honeypot')
  await expect(honeypot).toHaveCount(1)
  // inert, rather than aria-hidden wrapped around a focusable input.
  await expect(honeypot).toHaveAttribute('inert', '')
  await expect(honeypot).not.toHaveAttribute('aria-hidden', 'true')
  // Still rendered and still named, so the empty-value spam check keeps working.
  await expect(page.locator('.honeypot input[name="website"]')).toHaveCount(1)
})

test('service titles carry one consistent size across both service grids', async ({ page }) => {
  await page.goto('/')
  const sizes = await page.locator('.hybrid-capability-item h3, .hybrid-capability-more h3').evaluateAll((elements) =>
    Array.from(new Set(elements.map((element) => getComputedStyle(element).fontSize))),
  )
  expect(sizes, 'primary and secondary service cards must not diverge in size').toHaveLength(1)
})

test('descriptive homepage body copy is not set below 15px', async ({ page }) => {
  await page.goto('/')
  const selectors = [
    '.hybrid-capability-item small',
    '.hybrid-capability-more small',
    '.hybrid-coverage-grid span',
    '.hybrid-check-list li',
    '.hybrid-capability-panel li',
  ].join(', ')
  const tooSmall = await page.locator(selectors).evaluateAll((elements) =>
    elements
      .filter((element) => parseFloat(getComputedStyle(element).fontSize) < 15)
      .map((element) => `${element.className || element.tagName}: ${getComputedStyle(element).fontSize}`),
  )
  expect(tooSmall).toEqual([])
})

/** The consent checkbox only exists on the final review step. */
async function advanceToReviewStep(page: import('@playwright/test').Page) {
  await page.getByLabel(/Pickup suburb/i).fill('Sydney 2000')
  await page.getByLabel(/Preferred pickup date/i).fill('2030-01-01')
  await page.getByRole('button', { name: /^Next$/ }).click()
  await page.getByLabel(/Delivery suburb/i).fill('Melbourne 3000')
  await page.getByRole('button', { name: /^Next$/ }).click()
  await page.getByLabel(/Service type/i).selectOption({ index: 1 })
  await page.getByLabel(/Urgency/i).selectOption({ index: 1 })
  await page.getByLabel(/Freight description/i).fill('Two pallets of packaged goods, forklift access both ends.')
  await page.getByLabel(/Approximate number of items/i).fill('2')
  await page.getByRole('button', { name: /^Next$/ }).click()
  await page.getByLabel(/First name/i).fill('Alex')
  await page.getByLabel(/Last name/i).fill('Taylor')
  await page.getByLabel(/Company name/i).fill('Example Freight')
  await page.getByLabel(/Email/i).fill('alex@example.com')
  await page.getByLabel(/Phone/i).fill('0400000000')
  await page.getByRole('button', { name: /^Next$/ }).click()
  await expect(page.locator('.check-field')).toBeVisible()
}
