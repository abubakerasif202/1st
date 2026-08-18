import imageManifest from '../../data/imageManifest.json'

interface ManifestEntry {
  width: number
  height: number
  /** Every rendered width, largest last. The largest is the original file. */
  widths: number[]
}

const manifest = imageManifest as Record<string, ManifestEntry>

const variantSrc = (src: string, width: number, intrinsicWidth: number) =>
  width === intrinsicWidth ? src : src.replace(/\.webp$/, `-${width}.webp`)

interface ResponsiveImageProps {
  src: string
  alt: string
  /** Slot width per breakpoint. Getting this wrong is the only way to make srcset pick badly. */
  sizes: string
  className?: string
  /** Set on the LCP image only: eager + high fetch priority. Everything else lazy-loads. */
  priority?: boolean
  /** Decorative images pass alt="" and this, so assistive tech skips them entirely. */
  hidden?: boolean
}

/**
 * An <img> that serves the narrowest file covering its slot.
 *
 * Intrinsic width and height come from src/data/imageManifest.json (written by
 * `npm run optimize:images`) rather than being typed in per usage — the
 * hand-maintained values had drifted, so several 1376x768 photos were declaring
 * a 1672x941 box and reserving the wrong amount of space.
 *
 * An image missing from the manifest still renders; it just ships without a
 * srcset instead of pointing at variant files that were never generated.
 */
export function ResponsiveImage({ src, alt, sizes, className, priority = false, hidden = false }: ResponsiveImageProps) {
  const entry = manifest[src]
  const srcSet = entry?.widths.length
    ? entry.widths.map(width => `${variantSrc(src, width, entry.width)} ${width}w`).join(', ')
    : undefined

  const priorityProps = priority ? { fetchpriority: 'high' as const } : {}
  return <img
    {...priorityProps}
    className={className}
    /*
     * A photo that 404s or fails to decode used to leave the reserved box empty
     * — on a light section that reads as a broken page. Marking the element
     * instead lets CSS paint the brand placeholder ground it already uses while
     * the file is in flight, so a failure degrades to "image pending" rather
     * than "something is wrong with this site".
     */
    onError={(event) => event.currentTarget.classList.add('is-broken')}
    src={src}
    srcSet={srcSet}
    sizes={srcSet ? sizes : undefined}
    alt={alt}
    aria-hidden={hidden || undefined}
    width={entry?.width}
    height={entry?.height}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
  />
}
