// Builds the responsive width variants that ResponsiveImage serves, plus the
// manifest that tells the component each image's intrinsic size.
//
// Runs over the WebP files already in public/images/replacement (the output of
// optimize-images.mjs) rather than the PNG masters, so re-running it never
// re-encodes — and therefore never churns — the full-size images that are
// already committed.
//
// A phone was downloading the same 1672px hero as a 27" monitor; each variant
// below is a real width the layout asks for, so `sizes` can pick the cheapest
// file that still covers the slot.

import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const photoDir = path.join(projectRoot, 'public', 'images', 'replacement')
const manifestPath = path.join(projectRoot, 'src', 'data', 'imageManifest.json')

// 640 covers every phone at 2x DPR for a half-width slot and 1x for full-bleed;
// 1024 covers tablets and 2x phones on full-bleed heroes. Above that the
// original is already the right size.
const VARIANT_WIDTHS = [640, 1024]
const WEBP_QUALITY = 78
const isVariant = (name) => /-\d+\.webp$/.test(name)

const files = (await readdir(photoDir))
  .filter((name) => name.endsWith('.webp') && !isVariant(name))
  .sort()

if (!files.length) throw new Error(`No WebP sources found in ${photoDir}`)

const manifest = {}

for (const name of files) {
  const source = path.join(photoDir, name)
  const { width, height } = await sharp(source).metadata()
  const widths = []

  for (const target of VARIANT_WIDTHS) {
    // Never upscale: a variant wider than the source would be a bigger file
    // carrying no extra detail.
    if (target >= width) continue
    const variantPath = path.join(photoDir, name.replace(/\.webp$/, `-${target}.webp`))
    await sharp(source).resize({ width: target }).webp({ quality: WEBP_QUALITY }).toFile(variantPath)
    widths.push(target)
  }

  widths.push(width)
  manifest[`/images/replacement/${name}`] = { width, height, widths }
  console.log(`${name.padEnd(40)} ${width}x${height}  variants: ${widths.join(', ')}`)
}

const serialised = `${JSON.stringify(manifest, null, 2)}\n`
const previous = await readFile(manifestPath, 'utf8').catch(() => '')
if (previous !== serialised) await writeFile(manifestPath, serialised)

console.log(`\nManifest ${previous === serialised ? 'unchanged' : 'updated'}: ${Object.keys(manifest).length} images`)
