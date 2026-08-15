// Converts the source PNG photography into web-weight WebP, and generates the
// social-card JPEG and PWA icons. Run with `npm run optimize:images` after
// adding or replacing anything in assets/source-images/replacement-masters.
//
// Reads from assets/ and writes into public/: the masters are multi-megabyte PNG
// exports that must never ship, so they are deliberately kept outside public/
// where Vite would copy them into dist/.

import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const masterDir = path.join(projectRoot, 'assets', 'source-images', 'replacement-masters')
const photoDir = path.join(projectRoot, 'public', 'images', 'replacement')
const brandDir = path.join(projectRoot, 'public', 'brand')

const MAX_WIDTH = 1920
const WEBP_QUALITY = 78
const OG_SOURCE = 'prime-mover-hero-branded.png'
const kb = (bytes) => `${Math.round(bytes / 1024)} kB`

async function sizeOf(file) {
  try { return (await stat(file)).size } catch { return 0 }
}

async function toWebp(sourcePath) {
  const target = path.join(photoDir, path.basename(sourcePath).replace(/\.png$/, '.webp'))
  await sharp(sourcePath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(target)
  const [before, after] = [await sizeOf(sourcePath), await sizeOf(target)]
  console.log(`${path.basename(target).padEnd(42)} ${kb(before).padStart(9)} -> ${kb(after).padStart(8)}`)
  return before - after
}

// Social scrapers are inconsistent about WebP, so the card stays a JPEG at the
// 1.91:1 ratio Open Graph expects.
async function buildSocialCard() {
  const target = path.join(photoDir, 'social-card.jpg')
  await sharp(path.join(masterDir, OG_SOURCE))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(target)
  console.log(`social-card.jpg                            ->${kb(await sizeOf(target)).padStart(9)}`)
}

async function buildIcons() {
  // Built from the transparent logo, then flattened: an installed app icon has
  // to be opaque, and a maskable one especially — the launcher crops it to
  // whatever shape it likes and any alpha shows through as a hole.
  const source = path.join(brandDir, 'first-class-express-logo.webp')
  for (const size of [192, 512]) {
    const target = path.join(brandDir, `icon-${size}.png`)
    await sharp(source)
      .resize({ width: size, height: size, fit: 'contain', background: '#070708' })
      .flatten({ background: '#070708' })
      .png()
      .toFile(target)
    console.log(`icon-${size}.png`)
  }
  // Maskable icons need the logo inset so the safe zone survives a circle crop.
  await sharp(source)
    .resize({ width: 410, height: 410, fit: 'contain', background: '#070708' })
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: '#070708' })
    .flatten({ background: '#070708' })
    .png()
    .toFile(path.join(brandDir, 'icon-maskable-512.png'))
  console.log('icon-maskable-512.png')
}

const files = (await readdir(masterDir)).filter((name) => name.endsWith('.png'))
if (!files.length) throw new Error(`No PNG masters found in ${masterDir}`)
let saved = 0
for (const name of files) saved += await toWebp(path.join(masterDir, name))
await buildSocialCard()
await buildIcons()
console.log(`\nConverted ${files.length} images, saved ${kb(saved)}`)
