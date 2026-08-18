import type { Page } from '@playwright/test'

/**
 * Computed foreground/background contrast for a single element, measured in the
 * real browser rather than by re-deriving the cascade from the stylesheets.
 *
 * LIMITATIONS — read before trusting a number from this helper:
 *  - The background is the nearest ancestor with a non-transparent
 *    `background-color`. Background *images*, gradients and ::before overlays
 *    are ignored, so a light photo behind white text still reports whatever
 *    solid colour sits under it. Every surface asserted below also paints a
 *    solid colour, which is what makes the measurement meaningful here.
 *  - `opacity`, `filter`, `mix-blend-mode` and text-shadow are not modelled.
 *  - Partially transparent foregrounds are composited over the resolved
 *    background; partially transparent *backgrounds* are composited over their
 *    own ancestor chain.
 *
 * It is therefore a guard against the failure mode this suite exists for —
 * text that has collapsed onto its own background, or dropped a surface role —
 * not a general-purpose WCAG auditor.
 */
export async function contrastRatio(page: Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) throw new Error(`No element matched ${sel}`)

    const parse = (value: string): [number, number, number, number] => {
      const parts = value.match(/[\d.]+/g)?.map(Number) ?? []
      return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 1]
    }

    const over = (top: number[], bottom: number[], alpha: number) =>
      top.map((channel, i) => channel * alpha + bottom[i] * (1 - alpha))

    // Nearest painted ancestor background, composited down to an opaque colour.
    const backgroundOf = (start: Element): number[] => {
      const layers: Array<[number[], number]> = []
      for (let node: Element | null = start; node; node = node.parentElement) {
        const [r, g, b, a] = parse(getComputedStyle(node).backgroundColor)
        if (a > 0) {
          layers.push([[r, g, b], a])
          if (a === 1) break
        }
      }
      return layers.reduceRight<number[]>((below, [colour, alpha]) => over(colour, below, alpha), [255, 255, 255])
    }

    const [fr, fg, fb, fa] = parse(getComputedStyle(element).color)
    const background = backgroundOf(element)
    const foreground = over([fr, fg, fb], background, fa)

    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((channel) => {
        const c = channel / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const light = luminance(foreground)
    const dark = luminance(background)
    return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05)
  }, selector)
}
