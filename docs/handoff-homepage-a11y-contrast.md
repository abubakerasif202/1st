## Handoff Spec: Homepage Accessibility — Contrast & Consistency Fixes

### Overview
Follow-up remediation from a design-critique pass on the homepage (`src/pages/HomePage.tsx`). Five independent issues, all fixed in commit [3a989db](../../commit/3a989db): two WCAG AA contrast failures, one stale-CSS-inheritance bug (mobile nav font), one touch-target size failure, and one CTA-wording inconsistency. No layout, markup structure, or component API changed — this is token/value-level only.

### Files Touched
| File | Change |
|------|--------|
| `src/styles/lovable-refresh.css` | `--red` / `--muted` token values darkened; `.mobile-panel nav a` gets explicit font; `.footer-brand p` gets explicit color; `.lovable-service-card a` min-height added |
| `src/pages/HomePage.tsx` | Hero enquiry card CTA copy |
| `src/components/layout/MobileActionBar.tsx` | Mobile quote CTA copy |

### Design Tokens Used
| Token | Old Value | New Value | Contrast Before → After | Usage |
|-------|-----------|-----------|--------------------------|-------|
| `--red` | `#ed334f` | `#d42d48` | 4.05:1 → 4.52:1 (white text, on itself as bg) | Primary CTAs (`.header-cta`, `.btn-primary`, `.lovable-btn--primary`), icon accents |
| `--muted` | `#68747d` | `#5b6670` | 4.28:1 → 4.6:1 (against `#fff`) | Body copy in cards, feature blocks, process steps, quote-side labels |

Both were failing WCAG AA (4.5:1 minimum for normal-weight text). Token values are defined once in the `:root` block at the top of `lovable-refresh.css` — do not reintroduce the old hex values in component-level overrides.

### Non-Token Fixes

**Footer tagline color**
- Selector: `.footer-brand p`
- Before: no explicit color → inherited a stale rule from `index.css` that resolved to `3.99:1` against the dark footer background (`#0b1015`).
- After: explicit `color:#bcc6cc` (matches the rest of `.footer-grid a, .footer-grid span`).
- **Why explicit, not just relying on cascade order**: the stale `index.css` rule is still present elsewhere in the codebase; an explicit declaration here is the only guarantee against a future cascade reorder reintroducing the bug. Worth auditing `index.css` separately for other orphaned rules with the same failure mode.

**Mobile nav font drift**
- Selector: `.mobile-panel nav a`
- Before: no explicit `font-family`/`font-size` → inherited a leftover Georgia-serif rule from `index.css`.
- After: `font-family:'Barlow',sans-serif; font-size:1.05rem` (matches the site's sans-serif system).
- Visual-only fix, not contrast-related — flagged in the same critique pass because the drawer looked inconsistent with the rest of the site's type system.

**Touch target — service card "Learn more" links**
- Selector: `.lovable-service-card a, .fleet-card-link, .service-detail-card a`
- Before: `22px` effective height (line-height only, no explicit min-height).
- After: `min-height:44px` added, `align-items:center` kept for vertical centering.
- Meets WCAG 2.2 SC 2.5.8 (Target Size, Minimum — 24×24px) and the more conservative 44px iOS/Android guideline. Applies to three selectors sharing one rule — service cards, fleet cards, and service detail cards all inherit the fix from a single declaration.

### CTA Copy Unification
| Location | Before | After |
|----------|--------|-------|
| Hero enquiry card (`HomePage.tsx`) | "Start Your Enquiry" | "Request a Quote" |
| Mobile action bar (`MobileActionBar.tsx`) | "Get Quote" | "Quote" |

Both link to `/quote`. Every homepage entry point to the quote flow now uses "Request a Quote" (full CTAs) or "Quote" (icon-label CTAs, space-constrained: header CTA, mobile action bar). No third variant should be introduced — if a new quote CTA is added anywhere on the site, match one of these two forms rather than coining new copy.

### States and Interactions
No new states introduced. Existing hover/focus states are unaffected — `:hover`/`:after` rules referencing `var(--red)` automatically pick up the new darker value with no additional changes needed.

### Accessibility Notes
- Both contrast fixes verified against **normal-weight text on solid backgrounds** at WCAG AA (4.5:1). Large-text-only surfaces (headings ≥24px/19px-bold) were not in scope since they only need 3:1.
- Touch target fix targets **Level AAA-adjacent** guidance (44px) rather than the WCAG 2.2 AA minimum (24px) — matches the size already used elsewhere on the site (`.header-cta` is 46px min-height, form buttons 52px), so this is a consistency fix as much as a compliance one.
- No focus-visible, ARIA, or keyboard-interaction changes were required or made in this pass — a follow-up accessibility sweep should still check focus-ring visibility against the new `--red`/`--muted` values, since focus indicators sometimes reuse these tokens.

### Edge Cases
- **Dark-mode / `--red` reuse**: `--red` is also used for box-shadow glow (`rgba(237,51,79,.2)` → updated to `rgba(212,45,72,.2)` to match) and border accents (`.lovable-kicker:before`, `.desktop-nav a:after`). All decorative (non-text) uses were updated for visual consistency even though decorative elements aren't subject to the 4.5:1 requirement.
- **Stale `index.css` rules**: both bugs fixed here (footer color, mobile nav font) came from the same root cause — old rules in `index.css` that `lovable-refresh.css` doesn't fully override. Any other `.mobile-panel` or `.footer-*` selector not explicitly covered in `lovable-refresh.css` may still be silently inheriting stale values; worth a targeted audit before the next design pass rather than fixing reactively per report.

### Verification
- `.claude/launch.json` added in this commit so the dev server can be opened directly for contrast/visual spot-checks going forward — no test suite changes were needed since this is a pure CSS/copy diff with no logic change.
