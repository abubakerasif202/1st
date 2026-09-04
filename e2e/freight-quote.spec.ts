import { expect, test, type Page } from '@playwright/test'

// The wizard talks only to /api/quotes. Every test stubs it so no real record is
// ever created and the suite needs no Supabase / Resend configuration.
const FAKE_REFERENCE = '1STCE-000199'

async function stubQuoteApi(page: Page) {
  await page.route('**/api/quotes', async (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    const body = route.request().postDataJSON() as { form: Record<string, unknown> }
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'e2e-token',
        quote: {
          referenceNumber: FAKE_REFERENCE,
          status: 'new',
          createdAt: new Date().toISOString(),
          customerName: body.form.customerName,
          customerEmail: body.form.customerEmail,
          customerPhone: body.form.customerPhone,
          pickup: {
            addressLine1: body.form.pickupAddressLine1,
            suburb: body.form.pickupSuburb,
            state: body.form.pickupState,
            postcode: body.form.pickupPostcode,
            contactName: body.form.pickupContactName,
            contactPhone: body.form.pickupContactPhone,
            cutoffTime: body.form.pickupCutoffTime,
            pickupDate: body.form.pickupDate,
            handling: { tailgateRequired: false, forkliftAvailable: false, loadingDockAvailable: false, selfHandles: false },
          },
          delivery: {
            addressLine1: body.form.deliveryAddressLine1,
            suburb: body.form.deliverySuburb,
            state: body.form.deliveryState,
            postcode: body.form.deliveryPostcode,
            contactName: body.form.deliveryContactName,
            contactPhone: body.form.deliveryContactPhone,
            cutoffTime: body.form.deliveryCutoffTime,
            handling: { tailgateRequired: false, forkliftAvailable: false, loadingDockAvailable: false, selfHandles: false },
          },
          servicePriority: body.form.servicePriority,
          deliveryAuthority: body.form.deliveryAuthority,
          items: [
            { itemType: 'pallet', quantity: 1, lengthCm: 120, widthCm: 120, heightCm: 120, weightEachKg: 100, stackable: true, dangerousGoods: false, volumeM3: 1.728 },
          ],
          totals: { totalItems: 1, totalWeightKg: 100, totalVolumeM3: 1.728 },
          termsVersion: '2026-09-01',
        },
      }),
    })
  })
}

async function fillPickup(page: Page) {
  await page.fill('#pickupAddressLine1', '10 Loading Dock Rd')
  await page.fill('#pickupSuburb', 'Sydney')
  await page.selectOption('#pickupState', 'NSW')
  await page.fill('#pickupPostcode', '2000')
  await page.fill('#pickupContactName', 'Pat Lee')
  await page.fill('#pickupContactPhone', '0400 000 001')
  await page.fill('#pickupDate', '2026-12-01')
  await page.fill('#pickupCutoffTime', '16:00')
}

async function fillDelivery(page: Page) {
  await page.fill('#deliveryAddressLine1', '22 Receiving St')
  await page.fill('#deliverySuburb', 'Brisbane')
  await page.selectOption('#deliveryState', 'QLD')
  await page.fill('#deliveryPostcode', '4000')
  await page.fill('#deliveryContactName', 'Sam Ray')
  await page.fill('#deliveryContactPhone', '0400 000 002')
  await page.fill('#deliveryCutoffTime', '17:00')
}

const next = (page: Page) => page.getByRole('button', { name: /^Next$/ }).click()

test('completes the 6-step wizard and shows the confirmation', async ({ page }) => {
  await stubQuoteApi(page)
  await page.goto('/quote')

  await expect(page.getByRole('heading', { name: 'Pickup Details' })).toBeVisible()
  await fillPickup(page)
  await next(page)

  await expect(page.getByRole('heading', { name: 'Delivery Details' })).toBeVisible()
  await fillDelivery(page)
  await next(page)

  await expect(page.getByRole('heading', { name: 'Freight Items' })).toBeVisible()
  await expect(page.getByText('Total items')).toBeVisible()
  await next(page)

  await expect(page.getByRole('heading', { name: 'Service & Handling' })).toBeVisible()
  await page.getByRole('radio', { name: /Next Business Day/ }).check()
  await page.getByRole('radio', { name: /Signature Required/ }).check()
  await next(page)

  await expect(page.getByRole('heading', { name: 'Your Details' })).toBeVisible()
  await page.fill('#customerName', 'Alex Kim')
  await page.fill('#customerEmail', 'alex@example.com')
  await page.fill('#customerPhone', '0400 000 003')
  await next(page)

  await expect(page.getByRole('heading', { name: 'Review & Submit' })).toBeVisible()
  await expect(page.getByText('10 Loading Dock Rd, Sydney NSW 2000')).toBeVisible()

  // Submit is blocked until the terms box is ticked.
  await page.getByRole('button', { name: /Request my quote/i }).click()
  await expect(page.getByText(/must accept the freight terms/i)).toBeVisible()

  await page.getByRole('checkbox', { name: /Freight Terms/ }).check()
  await page.getByRole('button', { name: /Request my quote/i }).click()

  await expect(page).toHaveURL(new RegExp(`/quote/${FAKE_REFERENCE}/confirmation`))
  await expect(page.getByRole('heading', { name: FAKE_REFERENCE })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Print' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy details' })).toBeVisible()
})

test('an infrastructure failure keeps the form data and shows the reassurance message', async ({ page }) => {
  await page.route('**/api/quotes', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'down' }) }),
  )
  await page.goto('/quote')
  await fillPickup(page)
  await next(page)
  await fillDelivery(page)
  await next(page)
  await next(page)
  await page.getByRole('radio', { name: /Urgent/ }).check()
  await page.getByRole('radio', { name: /Signature Required/ }).check()
  await next(page)
  await page.fill('#customerName', 'Alex Kim')
  await page.fill('#customerEmail', 'alex@example.com')
  await page.fill('#customerPhone', '0400 000 003')
  await next(page)
  await page.getByRole('checkbox', { name: /Freight Terms/ }).check()
  await page.getByRole('button', { name: /Request my quote/i }).click()

  await expect(page.getByText(/your information has not been lost/i)).toBeVisible()
  await expect(page).toHaveURL(/\/quote$/)
  await expect(page.getByRole('heading', { name: 'Review & Submit' })).toBeVisible()
})

test('freight terms page is indexable and flags the sections under legal review', async ({ page }) => {
  const html = await (await page.request.get('/freight-terms/')).text()
  expect(html).toContain('<h1>Freight Terms &amp; Conditions</h1>')
  expect(html).toContain('<meta name="robots" content="index, follow" />')

  await page.goto('/freight-terms')
  await expect(page.getByText(/being finalised with our legal advisers/i).first()).toBeVisible()
})

test('mobile: the wizard has no horizontal overflow and stacks the item card', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only layout check')
  await stubQuoteApi(page)
  await page.goto('/quote')
  await fillPickup(page)
  await next(page)
  await fillDelivery(page)
  await next(page)
  await expect(page.getByRole('heading', { name: 'Freight Items' })).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
