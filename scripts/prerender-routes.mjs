import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(projectRoot, 'dist')
const templatePath = path.join(outputRoot, 'index.html')
const routeConfigPath = path.join(projectRoot, 'src', 'data', 'routeSeo.json')
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml')
const vercelConfigPath = path.join(projectRoot, 'vercel.json')
const siteUrl = (process.env.VITE_SITE_URL || 'https://www.1stclassexpress.com.au').replace(/\/$/, '')
const socialImage = `${siteUrl}/images/generated/hero-kenworth-linehaul.jpg`
const markerPattern = /<!-- route-meta:start -->[\s\S]*?<!-- route-meta:end -->/

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

function renderMetadata(route, { indexable = true, canonical = true } = {}) {
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)
  const routeUrl = `${siteUrl}${route.path === '/' ? '/' : route.path}`
  const tags = [
    '<!-- route-meta:start -->',
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
  ]

  if (canonical) tags.push(`    <link rel="canonical" href="${escapeHtml(routeUrl)}" />`)

  tags.push(
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:url" content="${escapeHtml(routeUrl)}" />`,
    '    <meta property="og:site_name" content="1st Class Express" />',
    '    <meta property="og:locale" content="en_AU" />',
    `    <meta property="og:image" content="${escapeHtml(socialImage)}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${escapeHtml(socialImage)}" />`,
    '    <!-- route-meta:end -->',
  )

  return tags.join('\n')
}

function applyMetadata(template, route, options) {
  if (!markerPattern.test(template)) throw new Error('Route metadata markers are missing from dist/index.html')
  return template.replace(markerPattern, renderMetadata(route, options))
}

const [template, routeConfigRaw, sitemap, vercelConfigRaw] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(routeConfigPath, 'utf8'),
  readFile(sitemapPath, 'utf8'),
  readFile(vercelConfigPath, 'utf8'),
])
const routeConfig = JSON.parse(routeConfigRaw)
const vercelConfig = JSON.parse(vercelConfigRaw)
const publicRoutes = Object.entries(routeConfig).filter(([name]) => name !== 'notFound')
const publicPaths = publicRoutes.map(([, route]) => route.path)
const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname)
const rewritePaths = vercelConfig.rewrites.map(({ source }) => source)
const expectedRewritePaths = publicPaths.filter((routePath) => routePath !== '/')

const assertSamePaths = (label, actual, expected) => {
  const sortedActual = [...actual].sort()
  const sortedExpected = [...expected].sort()
  if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
    throw new Error(`${label} routes do not match routeSeo.json: ${JSON.stringify(sortedActual)} !== ${JSON.stringify(sortedExpected)}`)
  }
}

assertSamePaths('Sitemap', sitemapPaths, publicPaths)
assertSamePaths('Vercel rewrite', rewritePaths, expectedRewritePaths)

if (vercelConfig.rewrites.some(({ source }) => source.includes('*') || source.includes('(.*)'))) {
  throw new Error('Catch-all Vercel rewrites are not allowed because they turn unknown routes into soft 404s')
}

for (const [, route] of publicRoutes) {
  const html = applyMetadata(template, route)
  const outputPath = route.path === '/'
    ? templatePath
    : path.join(outputRoot, route.path.slice(1), 'index.html')
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

await writeFile(
  path.join(outputRoot, '404.html'),
  applyMetadata(template, routeConfig.notFound, { indexable: false, canonical: false }),
)

for (const [, route] of publicRoutes) {
  const outputPath = route.path === '/'
    ? templatePath
    : path.join(outputRoot, route.path.slice(1), 'index.html')
  const html = await readFile(outputPath, 'utf8')
  const expected = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${escapeHtml(`${siteUrl}${route.path}`)}" />`,
  ]
  if (!expected.every((value) => html.includes(value))) throw new Error(`Generated metadata validation failed for ${route.path}`)
}

const notFoundHtml = await readFile(path.join(outputRoot, '404.html'), 'utf8')
if (!notFoundHtml.includes('noindex, nofollow') || notFoundHtml.includes('rel="canonical"')) {
  throw new Error('404.html must be noindex and must not declare a canonical URL')
}

console.log(`Generated ${publicRoutes.length} indexable route documents and 404.html`)
