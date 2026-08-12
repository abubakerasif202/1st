import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(projectRoot, 'dist')
const templatePath = path.join(outputRoot, 'index.html')
const routeConfigPath = path.join(projectRoot, 'src', 'data', 'routeSeo.json')
const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml')
const vercelConfigPath = path.join(projectRoot, 'vercel.json')
const siteUrl = (process.env.VITE_SITE_URL || 'https://www.1stclassexpress.com.au').replace(/\/$/, '')
const socialImage = `${siteUrl}/images/replacement/social-card.jpg`
const markerPattern = /<!-- route-meta:start -->[\s\S]*?<!-- route-meta:end -->/
const rootPattern = /<div id="root"><\/div>/
// Text unique to NotFoundPage and to App's Suspense fallback. Both are legitimate
// at runtime but must never end up baked into an indexable prerendered document.
const NOT_FOUND_MARKER = '404 — Wrong turn'
const SUSPENSE_MARKER = 'Loading 1st Class Express'
// pathToFileURL matters on Windows: a bare absolute path is not a valid ESM specifier.
const { render } = await import(pathToFileURL(path.join(projectRoot, 'dist-ssr', 'entry-server.js')).href)

// Crawlers that do not execute JavaScript — most notably the AI answer-engine
// bots — only ever see what lands inside #root here, so every route ships fully
// rendered markup and the browser hydrates it.
async function applyMarkup(template, route) {
  if (!rootPattern.test(template)) throw new Error('The #root mount point is missing from dist/index.html')
  const markup = await render(route.path)
  if (markup.length < 1000) throw new Error(`Prerendered markup for ${route.path} is suspiciously small (${markup.length} chars)`)
  return template.replace(rootPattern, `<div id="root">${markup}</div>`)
}

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
  const html = await applyMarkup(applyMetadata(template, route), route)
  const outputPath = route.path === '/'
    ? templatePath
    : path.join(outputRoot, route.path.slice(1), 'index.html')
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

await writeFile(
  path.join(outputRoot, '404.html'),
  await applyMarkup(
    applyMetadata(template, routeConfig.notFound, { indexable: false, canonical: false }),
    routeConfig.notFound,
  ),
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
  if (!/<h1[\s>]/.test(html)) throw new Error(`Prerendered ${route.path} has no <h1> — the route did not render server-side`)
  // An <h1> alone is not proof the right page rendered: NotFoundPage has one too,
  // so an unwired route silently prerendered a 404 body under an indexable title.
  if (html.includes(NOT_FOUND_MARKER)) {
    throw new Error(`Prerendered ${route.path} rendered the 404 page — the route is missing from routes.tsx`)
  }
  if (html.includes(SUSPENSE_MARKER)) {
    throw new Error(`Prerendered ${route.path} contains only the Suspense fallback — the page was not resolved eagerly`)
  }
}

// Stamp per-URL <lastmod> from each page's last commit date. The checked-in
// sitemap stays the source of truth for which URLs exist (asserted above); only
// the dates are generated, because a hand-maintained date is always wrong.
const pageSources = {
  '/': 'HomePage', '/about': 'AboutPage', '/services': 'ServicesPage', '/fleet': 'FleetPage',
  '/service-areas': 'ServiceAreasPage', '/quote': 'BookNowPage', '/contact': 'ContactPage',
  '/careers': 'CareersPage', '/driver-handbook': 'DriverHandbookPage',
}

// Detail routes are rendered by one component each, so their lastmod tracks that
// component. Ordered longest-prefix-first: /service-areas/interstate/* must win
// over /service-areas/*.
const pageSourcePrefixes = [
  ['/service-areas/interstate/', 'RouteDetailPage'],
  ['/service-areas/', 'ServiceAreaDetailPage'],
  ['/services/', 'ServiceDetailPage'],
  ['/fleet/', 'FleetDetailPage'],
]

const lastModified = (routePath) => {
  const source = pageSources[routePath]
    ?? pageSourcePrefixes.find(([prefix]) => routePath.startsWith(prefix))?.[1]
  if (!source) throw new Error(`No page source mapped for ${routePath} — add it to pageSources`)
  try {
    const stdout = execFileSync('git', ['log', '-1', '--format=%cs', '--', `src/pages/${source}.tsx`], { cwd: projectRoot, encoding: 'utf8' }).trim()
    return stdout || undefined
  } catch {
    return undefined // Shallow clone or no git history available: omit lastmod rather than invent one.
  }
}

await writeFile(
  path.join(outputRoot, 'sitemap.xml'),
  sitemap.replace(/<url><loc>(.*?)<\/loc><\/url>/g, (match, loc) => {
    const stamp = lastModified(new URL(loc).pathname)
    return stamp ? `<url><loc>${loc}</loc><lastmod>${stamp}</lastmod></url>` : match
  }),
)

const notFoundHtml = await readFile(path.join(outputRoot, '404.html'), 'utf8')
if (!notFoundHtml.includes('noindex, nofollow') || notFoundHtml.includes('rel="canonical"')) {
  throw new Error('404.html must be noindex and must not declare a canonical URL')
}

console.log(`Generated ${publicRoutes.length} indexable route documents and 404.html`)
