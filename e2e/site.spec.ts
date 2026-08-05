import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.setItem('intro-seen', 'true')) })

test('primary journey and quote validation', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Moving Your Freight/i })).toBeVisible()
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: 'Our Services' }).click() } else { await page.getByRole('link', { name: 'Our Services' }).first().click() }
  await expect(page).toHaveURL(/our-services/)
  await expect(page.getByRole('heading', { level: 1, name: /Freight services shaped/i })).toBeFocused()
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: 'Our Fleet' }).click() } else { await page.getByRole('link', { name: 'Our Fleet' }).first().click() }
  await expect(page).toHaveURL(/our-fleet/)
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: /Book Now/i }).click() } else { await page.getByRole('link', { name: /Book Now/i }).first().click() }
  await expect(page).toHaveURL(/book-now/)
  await page.getByRole('button', { name: /Request My Quote/i }).click(); await expect(page.getByText('Enter your first name')).toBeVisible()
})

test('phone and email actions are valid', async ({ page }) => { await page.goto('/contact'); await expect(page.locator('a[href="tel:0431604240"]').first()).toBeVisible(); await expect(page.locator('a[href="mailto:enquiry@1stclassexpress.com.au"]').first()).toBeVisible() })

test('mobile navigation controls meet the 44px target size', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only target-size check')
  await page.goto('/')
  const undersized = await page.locator('.announcement a, .menu-button, .mobile-actions a').evaluateAll(elements => elements.filter(element => {
    const rect = element.getBoundingClientRect()
    return rect.width < 44 || rect.height < 44
  }).map(element => element.getAttribute('aria-label') || element.textContent?.trim()))
  expect(undersized).toEqual([])
})
