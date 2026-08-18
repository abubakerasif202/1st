/**
 * The canonical conversion action shared by the interior page heroes.
 *
 * Lives outside PageHero.tsx so that file exports components only (react-refresh),
 * and lives in one place so every hero CTA keeps the one approved wording. The
 * handoff spec pins site-wide quote copy to "Request a Quote" (full CTAs) or
 * "Quote" (icon-label CTAs) — do not coin a third variant here.
 */
export interface HeroCta {
  label: string
  to: string
}

export const QUOTE_CTA: HeroCta = { label: 'Request a Quote', to: '/quote' }
