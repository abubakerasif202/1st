// Keys the black background out of the supplied logo master and writes the two
// brand assets the site actually renders.
//
// The master arrived as artwork composited onto solid black, so every place the
// logo sat on the near-black site chrome showed a visible rectangle a shade off
// from its surroundings. Nothing here redraws or recolours the logo: pixels
// above the solid threshold are copied through untouched, and only the black
// ground and the anti-aliased edge between the two are turned into alpha.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const master = path.join(projectRoot, 'assets', 'source-images', 'first-class-express-logo-on-black.webp')
const brandDir = path.join(projectRoot, 'public', 'brand')

// Below LOW the pixel is background; above HIGH it is artwork and is left
// exactly as authored. The band between is the anti-aliased edge.
const LOW = 6
const HIGH = 40
// 816x900 is far more than the largest slot (170 CSS px in the footer, so 510px
// at 3x). Half size keeps every rendering crisp and the file small.
const LOGO_WIDTH = 560

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`

const { data, info } = await sharp(master).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const keyed = Buffer.alloc(data.length)

for (let i = 0; i < data.length; i += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
  const brightest = Math.max(r, g, b)
  const alpha = Math.min(1, Math.max(0, (brightest - LOW) / (HIGH - LOW)))

  if (alpha >= 1) {
    keyed[i] = r; keyed[i + 1] = g; keyed[i + 2] = b; keyed[i + 3] = 255
    continue
  }
  if (alpha <= 0) {
    keyed[i] = keyed[i + 1] = keyed[i + 2] = keyed[i + 3] = 0
    continue
  }
  // Un-premultiply the edge so it does not carry a black fringe onto a light
  // background — the handbook prints the logo on white.
  const scale = Math.min(255 / brightest, 1 / alpha)
  keyed[i] = Math.min(255, Math.round(r * scale))
  keyed[i + 1] = Math.min(255, Math.round(g * scale))
  keyed[i + 2] = Math.min(255, Math.round(b * scale))
  keyed[i + 3] = Math.round(alpha * 255)
}

const transparent = sharp(keyed, { raw: { width: info.width, height: info.height, channels: 4 } })

const logoPath = path.join(brandDir, 'first-class-express-logo.webp')
await transparent
  .clone()
  .resize({ width: LOGO_WIDTH })
  // alphaQuality below 100 matters here: a lossless alpha plane on artwork this
  // size doubled the file for a difference invisible at any rendered size.
  .webp({ quality: 82, alphaQuality: 60, effort: 6 })
  .toFile(logoPath)

/**
 * The bounding box of the "1e" monogram.
 *
 * The full lockup is four stacked elements — monogram, road, wordmark, tagline
 * — separated by bands of empty rows. A tab strip draws the icon at 16px, where
 * the wordmark and tagline are a grey smear, so the favicon uses the monogram
 * alone. Found by scanning rather than hard-coded, so a re-exported master with
 * different spacing still crops correctly.
 */
function monogramBox() {
  const rowHasInk = []
  for (let y = 0; y < info.height; y++) {
    let ink = false
    for (let x = 0; x < info.width && !ink; x++) ink = keyed[(y * info.width + x) * 4 + 3] > 8
    rowHasInk.push(ink)
  }

  // The monogram runs from the first inked row to the first gap taller than 2%
  // of the image — big enough to skip antialiasing gaps inside the letterforms.
  const minGap = Math.round(info.height * 0.02)
  const top = rowHasInk.indexOf(true)
  let bottom = info.height - 1
  for (let y = top, gap = 0; y < info.height; y++) {
    gap = rowHasInk[y] ? 0 : gap + 1
    if (gap >= minGap) { bottom = y - gap; break }
  }

  let left = info.width, right = 0
  for (let y = top; y <= bottom; y++) {
    for (let x = 0; x < info.width; x++) {
      if (keyed[(y * info.width + x) * 4 + 3] > 8) {
        if (x < left) left = x
        if (x > right) right = x
      }
    }
  }
  return { left, top, width: right - left + 1, height: bottom - top + 1 }
}

const box = monogramBox()
console.log(`monogram crop: ${box.width}x${box.height} at ${box.left},${box.top}`)
const monogram = await transparent.clone().extract(box).png().toBuffer()

/**
 * The monogram centred in a transparent square with a small margin, so the mark
 * is not flush against the edge of a tab or a home-screen tile.
 *
 * Deliberately three separate pipelines rather than one chain: sharp applies
 * its operations in a fixed order regardless of call order, so a chained
 * `.extend().flatten()` flattened first and left the padding transparent, and a
 * second `.resize()` in one chain silently replaces the first.
 */
async function squareMark(size, opaque = false) {
  const fitted = await sharp(monogram)
    .resize({ width: Math.round(size * 0.88), height: Math.round(size * 0.88), fit: 'inside' })
    .png()
    .toBuffer()
  const { width, height } = await sharp(fitted).metadata()
  const left = Math.floor((size - width) / 2)
  const top = Math.floor((size - height) / 2)

  const square = await sharp(fitted)
    .extend({ top, left, bottom: size - height - top, right: size - width - left, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  // iOS ignores alpha on a home-screen icon and composites it onto white, which
  // would put gold artwork on a white ground. Flatten it onto the brand black.
  return (opaque ? sharp(square).flatten({ background: '#070708' }) : sharp(square))
    .png({ compressionLevel: 9, palette: true })
}

const icons = [
  ['favicon-16.png', 16, false],
  ['favicon-32.png', 32, false],
  ['favicon-180.png', 180, true],
]
const iconPaths = []
for (const [name, size, opaque] of icons) {
  const target = path.join(brandDir, name)
  await (await squareMark(size, opaque)).toFile(target)
  iconPaths.push(target)
}

for (const file of [master, logoPath, ...iconPaths]) {
  console.log(`${path.basename(file).padEnd(42)} ${kb((await readFile(file)).byteLength).padStart(8)}`)
}
