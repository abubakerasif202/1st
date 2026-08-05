# Conversion-First Fleet Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the 1st Class Express homepage so quote enquiries are the primary journey and the branded fleet is the strongest proof point.

**Architecture:** Keep the existing React Router routes, shared layout, data modules, and Formspree submission adapter. Replace only the homepage composition, add a focused homepage quote form that reuses `submitQuoteRequest`, and append scoped responsive styles so the remaining pages retain their current contracts.

**Tech Stack:** React 18, TypeScript, React Router, React Hook Form, Zod, Framer Motion, Vitest, Testing Library, Playwright, Vite.

## Global Constraints

- Preserve `/about-us`, `/our-services`, `/our-fleet`, `/book-now`, `/contact`, and 404 route behaviour.
- Preserve `submitQuoteRequest` and the existing full quote form on `/book-now`.
- Use the existing black, gold, and red brand palette and supplied branded fleet assets.
- Remove the opening logo animation from the homepage journey.
- Keep keyboard focus handling, semantic headings, accessible labels, and 44px mobile action targets.
- Do not add dependencies, commit, push, deploy, or modify remote systems.

---

### Task 1: Lock the homepage conversion contract

**Files:**
- Modify: `src/test/routes.test.tsx`
- Modify: `e2e/site.spec.ts`

**Interfaces:**
- Consumes: the public `/` route rendered through `App`.
- Produces: regression coverage for the new hero headline, quote CTA, fleet CTA, and homepage quote form.

- [ ] **Step 1: Write the failing component-route tests**

```tsx
it('leads the homepage with the approved freight promise', async () => {
  await renderRoute('/')
  expect(await screen.findByRole('heading', {
    level: 1,
    name: /Reliable Freight\. Professional Drivers\. Australia-Wide\./i,
  })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Get a Free Quote/i })).toHaveAttribute('href', '#quick-quote')
  expect(screen.getByRole('link', { name: /Explore Our Fleet/i })).toHaveAttribute('href', '/our-fleet')
})

it('offers a streamlined quote form on the homepage', async () => {
  await renderRoute('/')
  expect(await screen.findByRole('form', { name: /Quick freight quote/i })).toBeInTheDocument()
  expect(screen.getByLabelText(/Pickup suburb or postcode/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Delivery suburb or postcode/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- src/test/routes.test.tsx --reporter=verbose`

Expected: FAIL because the approved headline, in-page quote link, and quick quote form do not exist.

- [ ] **Step 3: Update the Playwright primary journey expectation**

```ts
await expect(page.getByRole('heading', {
  name: /Reliable Freight\. Professional Drivers\. Australia-Wide\./i,
})).toBeVisible()
```

- [ ] **Step 4: Re-run the focused test to retain RED evidence**

Run: `npm test -- src/test/routes.test.tsx --reporter=verbose`

Expected: the same requirement-driven failures remain.

### Task 2: Add the streamlined homepage quote form

**Files:**
- Create: `src/components/forms/QuickQuoteForm.tsx`
- Modify: `src/test/forms.test.tsx`

**Interfaces:**
- Consumes: `submitQuoteRequest(payload: Record<string, unknown>): Promise<FormResult>`.
- Produces: `QuickQuoteForm(): JSX.Element`, with accessible name `Quick freight quote` and fields `name`, `companyName`, `email`, `phone`, `pickup`, `delivery`, `freight`, `consent`, and `website`.

- [ ] **Step 1: Write the failing validation test against the public homepage form**

```tsx
it('shows quick quote validation errors', async () => {
  render(<MemoryRouter><QuickQuoteForm /></MemoryRouter>)
  fireEvent.click(screen.getByRole('button', { name: /Get My Free Quote/i }))
  expect(await screen.findByText('Enter your name')).toBeInTheDocument()
  expect(screen.getByText('Enter pickup suburb or postcode')).toBeInTheDocument()
  expect(screen.getByText('Consent is required to submit')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the form test and verify RED**

Run: `npm test -- src/test/forms.test.tsx --reporter=verbose`

Expected: FAIL because `QuickQuoteForm` has not been implemented.

- [ ] **Step 3: Implement the minimal real form**

```tsx
const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  pickup: z.string().min(3, 'Enter pickup suburb or postcode'),
  delivery: z.string().min(3, 'Enter delivery suburb or postcode'),
  freight: z.string().min(10, 'Describe the freight'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to submit' }) }),
  website: z.string().max(0),
})
```

Render the fields through `FormField`, submit through `submitQuoteRequest`, keep the honeypot and customer-safe status handling used by the full quote form, and set `aria-label="Quick freight quote"` on the form.

- [ ] **Step 4: Run the focused form test and verify GREEN**

Run: `npm test -- src/test/forms.test.tsx --reporter=verbose`

Expected: PASS with no failures.

### Task 3: Replace the homepage with the approved conversion flow

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/data/companyProfile.ts`

**Interfaces:**
- Consumes: `services`, `fleet`, `companyProfile`, `QuickQuoteForm`, and existing branded images.
- Produces: hero → trust strip → fleet proof → six services → three-step process → credibility → quick quote.

- [ ] **Step 1: Update the approved homepage copy**

```ts
homepage: {
  title: 'Reliable Freight. Professional Drivers. Australia-Wide.',
  intro: 'From urgent Sydney deliveries to scheduled interstate freight, 1st Class Express keeps your business moving with the right vehicle, experienced drivers and clear communication.',
  detail: 'Tell us what is moving, where it needs to go and when it needs to arrive. We will assess the freight and respond with the right transport plan.',
  supportingLine: 'Fast quote response • Flexible fleet • Professional delivery',
},
```

- [ ] **Step 2: Implement the new homepage composition**

Use semantic sections and these stable public labels:

```tsx
<a className="btn-primary" href="#quick-quote">Get a Free Quote</a>
<ButtonLink to="/our-fleet" variant="secondary">Explore Our Fleet</ButtonLink>
<section className="fleet-proof-section">...</section>
<section className="services-section">{services.slice(0, 6).map(...)}</section>
<section className="process-section">...</section>
<section id="quick-quote" className="quick-quote-section">...</section>
```

Do not render `AnimatedLogoIntro`, `RouteMap`, the generic benefits grid, or the compact contact form on the homepage.

- [ ] **Step 3: Run the route test and verify GREEN**

Run: `npm test -- src/test/routes.test.tsx --reporter=verbose`

Expected: PASS for the homepage and all preserved routes.

### Task 4: Add scoped premium responsive styling

**Files:**
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: homepage classes from Task 3.
- Produces: a legible desktop layout, single-column mobile flow, visible focus states, branded fleet media, and a high-contrast quote panel.

- [ ] **Step 1: Add homepage-only layout rules**

```css
.conversion-hero__content { max-width: 760px; }
.fleet-proof-grid { display: grid; grid-template-columns: 1.35fr .65fr; gap: 1px; }
.process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
.quick-quote-grid { display: grid; grid-template-columns: .72fr 1.28fr; gap: clamp(2rem, 6vw, 6rem); }
```

Complete the rules with the existing design tokens, clear borders, readable muted copy, intrinsic image dimensions, 44px controls, and `:focus-visible` states.

- [ ] **Step 2: Add tablet and mobile collapse rules**

```css
@media (max-width: 1024px) {
  .fleet-proof-grid, .quick-quote-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .process-grid { grid-template-columns: 1fr; }
  .conversion-hero__actions { display: grid; }
}
```

- [ ] **Step 3: Run lint and type checking**

Run: `npm run lint && npm run typecheck`

Expected: exit 0 with no warnings or TypeScript errors.

### Task 5: Verify the integrated redesign

**Files:**
- Inspect only: all changed files and generated build output.

**Interfaces:**
- Consumes: the complete local diff.
- Produces: fresh test, build, desktop, and mobile evidence.

- [ ] **Step 1: Run the complete unit suite**

Run: `npm test -- --reporter=verbose`

Expected: all tests pass.

- [ ] **Step 2: Build the production site**

Run: `npm run build`

Expected: TypeScript, Vite build, and route prerender all exit 0.

- [ ] **Step 3: Run desktop and mobile browser journeys**

Run: `npm run test:e2e`

Expected: all Chromium desktop and Pixel 5 projects pass.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors, only planned files are modified, and no secrets or generated dependency files are included.
