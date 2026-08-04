import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.setItem('intro-seen', 'true')) })

test('primary journey and quote validation', async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Moving Your Freight/i })).toBeVisible()
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: 'Our Services' }).click() } else { await page.getByRole('link', { name: 'Our Services' }).first().click() }
  await expect(page).toHaveURL(/our-services/)
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: 'Our Fleet' }).click() } else { await page.getByRole('link', { name: 'Our Fleet' }).first().click() }
  await expect(page).toHaveURL(/our-fleet/)
  if (isMobile) { await page.getByRole('button', { name: 'Open menu' }).click(); await page.getByRole('dialog').getByRole('link', { name: /Book Now/i }).click() } else { await page.getByRole('link', { name: /Book Now/i }).first().click() }
  await expect(page).toHaveURL(/book-now/)
  await page.getByRole('button', { name: /Request My Quote/i }).click(); await expect(page.getByText('Enter your first name')).toBeVisible()
})

test('phone and email actions are valid', async ({ page }) => { await page.goto('/contact'); await expect(page.locator('a[href="tel:0431604240"]').first()).toBeVisible(); await expect(page.locator('a[href="mailto:enquiry@1stclassexpress.com.au"]').first()).toBeVisible() })
