import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// useLayoutEffect warns and is a no-op during SSR (prerendering). Falling back
// to useEffect there is safe: it simply never runs, so `pending` stays false
// and the server/no-JS markup renders the fully visible resting state.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Scroll-reveal for below-the-fold content. `pending` (and the opacity/transform
 * it triggers via `.reveal-pending` in motion.css) is only ever set client-side
 * inside a layout effect, which runs before the browser paints — so JS-less and
 * prerendered visitors always see the fully visible resting state, and JS
 * visitors never see a flash of the final state before the offset one.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [pending, setPending] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    setPending(true)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-revealed')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, className: pending ? 'reveal-pending' : '' }
}
