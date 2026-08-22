# 1st Class Express UI/UX Audit

Date: 23 August 2026  
Scope: public routed website, desktop and mobile, including navigation, conversion forms and shared layout.

## Design direction

The website should feel operational, assured and premium. Use the ink/cream brand surfaces, gold for proof and hierarchy, and red for conversion actions. Archivo provides a direct, high-impact display face; Barlow keeps dense service and form content readable. Motion should be subtle, optional and limited to transform/opacity. The full token and component specification is in `design-system/1st-class-express/MASTER.md`.

## Audit summary

### What is working

- The homepage follows a clear buyer sequence: capability, coverage, operational fit, then quote.
- Desktop navigation is predictable, sticky and paired with a persistent quote action.
- The mobile drawer traps focus, closes with Escape, restores focus and exposes phone/quote actions.
- Headings, labels, error associations, route-change focus and reduced-motion handling are well implemented.
- Forms use visible labels, semantic input types, field-level errors, loading states and explicit consent.
- Business content is internally consistent and appropriately conditional about acceptance and availability.
- Responsive grids collapse without horizontal scrolling; interactive controls generally meet 44px targets.

### Highest-impact findings and resolution

1. **Operational imagery was losing its subject.** The homepage operations image used the centre of a portrait asset inside a landscape frame, showing mostly dark sky. The focal point now shifts downward so the branded vehicles remain visible.
2. **The small-phone hero delayed the core journey.** Below 480px, four proof items became four full-width rows. The verified proof remains present in a compact two-column rail, with supporting descriptions limited to two lines at that constrained width.
3. **The mobile footer was excessively long.** Explore and Services now share a two-column layout on ordinary phones, while brand and contact retain full width. A single column remains only below 340px, preserving the compact layout at the audited 360px width.
4. **The fixed mobile quote destination lacked location state.** It now uses route-aware navigation and exposes the active route visually and semantically.
5. **The generated visual recommendation was too fashion-led.** Cormorant/Liquid Glass was rejected in favour of the existing Archivo/Barlow industrial-editorial system, semantic surface colours and restrained effects.
6. **Initial hydration could move focus and scroll the page.** The route focus manager now distinguishes a genuine navigation from the router's initial hydration update. Cold loads stay at the top while in-app route changes and fragment links retain their accessible focus behavior.

## Remaining opportunities

- Validate real-user completion rates before changing the five-step quote flow; it currently balances detail and cognitive load well.
- Measure image LCP and form abandonment in production before adding further animation or fields.
- Consider a shorter mobile footer disclosure pattern only after testing discoverability; all routes remain visible today.
- Re-test browser zoom at 200%, Windows high-contrast mode, iOS Safari and a physical Android device before treating the audit as full production accessibility certification.

## Verification matrix

- Automated layout matrix: all 29 public route states across 360px, 390px, 430px, 768px, 1024px, 1440px and 1920px viewports.
- Fresh visual captures: every public route at 390px and 1440px, with shared templates additionally checked across the full matrix.
- Interaction coverage: desktop navigation and hover states; mobile drawer focus trap, body lock and Escape close; sticky header, fixed mobile actions, footer, forms, focus indicators, image crop, wrapping and horizontal overflow.
- Required code validation: typecheck, lint, unit tests, production build and routed Playwright checks.
- External quote delivery, email delivery, analytics, production deployment and physical-device behavior are outside this local audit unless separately verified.
