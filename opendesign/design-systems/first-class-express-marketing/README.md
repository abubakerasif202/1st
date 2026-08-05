# 1st Class Express Marketing Design System

This system captures the current public website as an industrial-editorial freight brand: dark operational surfaces, warm gold structure, red conversion actions, serif display typography, sharp geometry, and documentary Australian truck imagery.

## Sources consulted

- `src/styles/index.css` for the production palette, typography, spacing, component states, layout rules, and responsive breakpoints.
- `src/components/` for navigation, buttons, headings, forms, service cards, calls to action, and route imagery.
- `src/pages/` for page composition, content hierarchy, and conversion patterns.
- `src/data/company.ts`, `src/data/services.ts`, and `src/data/fleet.ts` for terminology and voice.
- `public/brand/` and `public/images/generated/` for production identity and photography.
- The deployed routes at `https://www.1stclassexpress.com.au` for DOM, responsive, asset, and interaction checks.

## Index

- `tokens/colors_and_type.css` — canonical raw and semantic design tokens.
- `brand/voice-and-tone.md` — content rules and messaging boundaries.
- `brand/style-notes.md` — color, type, spacing, imagery, motion, and component conventions.
- `assets/` — copied production logo and fleet imagery.
- `ui-kit-marketing/components/` — source-faithful JSX component references.
- `ui-kit-marketing/index.html` — interactive visual inventory.

## Confidence and open decisions

High confidence: palette, typography pairing, sharp card language, gold borders, red CTAs, uppercase eyebrow labels, and freight photography direction all repeat consistently in production.

Needs future confirmation: the body typeface is declared as Inter but the site ships no Inter font file, so production usually resolves to Segoe UI. Treat Segoe UI as the current reliable body face until a licensed webfont is supplied. Business hours and client logos remain intentionally unpublished.
