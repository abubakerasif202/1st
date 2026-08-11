import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.setItem('intro-seen', 'true')) })

test('primary journey and quote validation', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Reliable Freight\. Professional Drivers\. Australia-Wide\./i })).toBeVisible()
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: 'Services' }).click() } else { await page.getByRole('link', { name: 'Services' }).first().click() }
  await expect(page).toHaveURL(/services/)
  await expect(page.getByRole('heading', { level: 1, name: /Transport Built Around Your Freight/i })).toBeFocused()
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: 'Our Fleet' }).click() } else { await page.getByRole('link', { name: 'Our Fleet' }).first().click() }
  await expect(page).toHaveURL(/fleet/)
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: /Request a Quote/i }).click() } else { await page.getByRole('link', { name: /Request a Quote/i }).first().click() }
  await expect(page).toHaveURL(/quote/)
  await page.getByRole('button', { name: /Next/i }).click()
  await expect(page.getByText('Enter pickup suburb or postcode')).toBeVisible()
  await expect(page.getByText('Select a preferred date')).toBeVisible()
})

// Asserts a *visible* action rather than the first in DOM order: the
// announcement bar is deliberately display:none below 820px, so `.first()`
// resolved to a hidden link on mobile even though the page offers several
// working ones.
test('phone and email actions are valid', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('a[href="tel:0431604240"]:visible').first()).toBeVisible()
  await expect(page.locator('a[href="mailto:enquiry@1stclassexpress.com.au"]:visible').first()).toBeVisible()
})

test('mobile navigation controls meet the 44px target size', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only target-size check')
  await page.goto('/')
  // Only elements that actually render can be tapped. The announcement bar is
  // display:none below 820px, so its links legitimately measure 0x0 — counting
  // them as undersized targets flagged controls no mobile user can reach.
  const undersized = await page.locator('.announcement a, .menu-button, .mobile-actions a').evaluateAll(elements => elements.filter(element => {
    const rect = element.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return false
    return rect.width < 44 || rect.height < 44
  }).map(element => element.getAttribute('aria-label') || element.textContent?.trim()))
  expect(undersized).toEqual([])
})

const detailRoutes = [
  ['/services/same-day', 'Same Day and Next Day'],
  ['/services/dangerous-goods', 'Dangerous Goods Transport'],
  ['/fleet/vans', '1-Tonne Vans'],
  ['/fleet/b-doubles', 'B-Double Configurations'],
  ['/service-areas/sydney', 'Sydney Metropolitan Freight Services'],
  ['/service-areas/interstate/sydney-melbourne', 'Sydney to Melbourne Freight Linehaul'],
] as const

// Fetched with a trailing slash on purpose: `vite preview` SPA-falls-back to
// dist/index.html for extensionless paths, so only the directory form returns
// the route's own document. Production serves the clean URL because vercel.json
// rewrites each path to that same file.
test('detail routes ship a real prerendered document, not a shell', async ({ page }) => {
  for (const [url, heading] of detailRoutes) {
    const html = await (await page.request.get(`${url}/`)).text()
    expect(html, `${url} h1`).toContain(`<h1>${heading}</h1>`)
    expect(html, `${url} canonical`).toContain(`<link rel="canonical" href="https://www.1stclassexpress.com.au${url}" />`)
    expect(html, `${url} indexable`).toContain('<meta name="robots" content="index, follow" />')
    expect(html, `${url} must not be the 404 body`).not.toContain('Wrong turn')
    expect(html, `${url} must not be the loading shell`).not.toContain('Loading 1st Class Express')
  }
})

test('detail routes render one breadcrumb trail in the browser', async ({ page }) => {
  for (const [url, heading] of detailRoutes) {
    await page.goto(url)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    // Exactly one breadcrumb landmark: PageHero must defer to <Breadcrumbs>.
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toHaveCount(1)
  }
})

test('an unknown detail id renders the noindex 404 rather than an empty shell', async ({ page }) => {
  await page.goto('/fleet/not-a-real-vehicle')
  await expect(page.getByText(/Wrong turn/i)).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
})

test('detail pages stay within the viewport on mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only overflow check')
  for (const url of ['/services/same-day', '/fleet/b-doubles', '/service-areas/interstate/sydney-melbourne']) {
    await page.goto(url)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `${url} overflows horizontally`).toBeLessThanOrEqual(1)
  }
})
