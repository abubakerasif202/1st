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
// Browsers draw a favicon at 16-64px; the 512 icon in the web manifest is what
// installers use, so this only needs to cover a retina tab strip.
const FAVICON_SIZE = 256

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

// Square, contain-fitted favicon. The logo-mark.jpg it replaces squeezed a
// 816x900 logo into a 300x300 box, so the mark was both distorted and boxed in
// black on every tab strip.
const markPath = path.join(brandDir, 'logo-mark.png')
await transparent
  .clone()
  .resize({ width: FAVICON_SIZE, height: FAVICON_SIZE, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: true })
  .toFile(markPath)

for (const file of [master, logoPath, markPath]) {
  console.log(`${path.basename(file).padEnd(42)} ${kb((await readFile(file)).byteLength).padStart(8)}`)
}
