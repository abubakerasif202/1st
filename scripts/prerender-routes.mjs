import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(projectRoot, 'dist')
const templatePath = path.join(outputRoot, 'index.html')
const routeConfigPath = path.join(projectRoot, 'src', 'data', 'routeSeo.json')
const fontsConfigPath = path.join(projectRoot, 'src', 'data', 'fonts.json')
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
async function renderRoute(route) {
  const markup = await render(route.path)
  if (markup.length < 1000) throw new Error(`Prerendered markup for ${route.path} is suspiciously small (${markup.length} chars)`)
  return markup
}

function applyMarkup(template, markup) {
  if (!rootPattern.test(template)) throw new Error('The #root mount point is missing from dist/index.html')
  return template.replace(rootPattern, `<div id="root">${markup}</div>`)
}

/**
 * A <link rel="preload"> for the route's own hero photograph.
 *
 * eager + fetchpriority on the <img> only helps once the parser has reached the
 * element, which on these documents is after the whole prerendered header. The
 * hero is the LCP element on every route, so it is worth discovering in the
 * head instead. Derived from the rendered markup rather than a hand-kept
 * path -> image table, because a table drifts the moment a page changes hero.
 *
 * imagesrcset/imagesizes are copied verbatim from the <img>: a bare href would
 * preload the full-width file and then let the browser download a different
 * srcset candidate, costing a second request on every phone. The brand mark in
 * the header is also fetchpriority=high, so the match is restricted to /images/.
 */
function heroPreload(markup) {
  // Case-insensitive: react-dom/server emits `srcSet`, not `srcset`. HTML
  // attribute names are case-insensitive so the browser does not care, but a
  // case-sensitive match here silently dropped imagesrcset from every preload
  // and left phones downloading the 1672w file next to the 640w one they used.
  const attribute = (tag, name) => tag.match(new RegExp(name + '="([^"]*)"', 'i'))?.[1]
  const hero = [...markup.matchAll(/<img\b[^>]*>/g)]
    .map(([tag]) => tag)
    .find((tag) => tag.includes('fetchpriority="high"') && /src="\/images\//.test(tag))
  if (!hero) return ''

  const href = attribute(hero, 'src')
  const srcset = attribute(hero, 'srcset')
  const sizes = attribute(hero, 'sizes')
  return [
    '    <link rel="preload" as="image" fetchpriority="high"',
    `href="${href}"`,
    srcset ? `imagesrcset="${srcset}"` : '',
    srcset && sizes ? `imagesizes="${sizes}"` : '',
    '/>',
  ].filter(Boolean).join(' ')
}

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

function renderMetadata(route, { indexable = true, canonical = true, preload = '' } = {}) {
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

  if (preload) tags.splice(1, 0, preload)

  return tags.join('\n')
}

function applyMetadata(template, route, options) {
  if (!markerPattern.test(template)) throw new Error('Route metadata markers are missing from dist/index.html')
  return template.replace(markerPattern, renderMetadata(route, options))
}

const [template, routeConfigRaw, sitemap, vercelConfigRaw, fontsConfigRaw] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(routeConfigPath, 'utf8'),
  readFile(sitemapPath, 'utf8'),
  readFile(vercelConfigPath, 'utf8'),
  readFile(fontsConfigPath, 'utf8'),
])
const routeConfig = JSON.parse(routeConfigRaw)
const fonts = JSON.parse(fontsConfigRaw)

// DriverHandbookPage appends this itself after a client-side navigation, but a
// cold load of the printable handbook has to arrive with its faces already
// declared, or the document reflows once the effect runs.
const withHandbookFonts = (html) =>
  html.replace('</head>', `    <link rel="stylesheet" href="${fonts.handbook.replaceAll('&', '&amp;')}" />\n  </head>`)
const vercelConfig = JSON.parse(vercelConfigRaw)
const publicRoutes = Object.entries(routeConfig).filter(([name]) => name !== 'notFound')
const publicPaths = publicRoutes.map(([, route]) => route.path)
const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => new URL(url).pathname)
// SPA-only routes: real pages that must never be indexed and have no prerendered
// document. Vercel serves the app shell (dist/app.html) and React renders them
// client-side. They are deliberately kept out of routeSeo.json / sitemap.xml.
// Each names an exact path shape with a :param — not a catch-all — so genuinely
// unknown URLs still hard-404.
const APP_SHELL_REWRITES = [
  { source: '/quote/:reference/confirmation', destination: '/app.html' },
  { source: '/quote/:reference/respond', destination: '/app.html' },
]
const appShellSources = APP_SHELL_REWRITES.map(({ source }) => source)

const rewritePaths = vercelConfig.rewrites
  .map(({ source }) => source)
  .filter((source) => !appShellSources.includes(source))
const expectedRewritePaths = publicPaths.filter((routePath) => routePath !== '/')

// Every declared app-shell rewrite must be present in vercel.json and point at
// the shell — nothing else.
for (const { source, destination } of APP_SHELL_REWRITES) {
  const match = vercelConfig.rewrites.find((rewrite) => rewrite.source === source)
  if (!match) throw new Error(`vercel.json is missing the app-shell rewrite for ${source}`)
  if (match.destination !== destination) {
    throw new Error(`app-shell rewrite ${source} must point at ${destination}, not ${match.destination}`)
  }
}

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

for (const [name, route] of publicRoutes) {
  const markup = await renderRoute(route)
  const rendered = applyMarkup(applyMetadata(template, route, { preload: heroPreload(markup) }), markup)
  const html = name === 'driverHandbook' ? withHandbookFonts(rendered) : rendered
  const outputPath = route.path === '/'
    ? templatePath
    : path.join(outputRoot, route.path.slice(1), 'index.html')
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

await writeFile(
  path.join(outputRoot, '404.html'),
  applyMarkup(
    applyMetadata(template, routeConfig.notFound, { indexable: false, canonical: false }),
    await renderRoute(routeConfig.notFound),
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
  '/service-areas': 'ServiceAreasPage', '/quote': 'BookNowPage', '/freight-terms': 'FreightTermsPage',
  '/contact': 'ContactPage', '/careers': 'CareersPage', '/driver-handbook': 'DriverHandbookPage',
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

// dist/app.html — the client-rendered shell for the SPA-only routes above. No
// prerendered body (React renders on load), noindex, no canonical.
const appShellRoute = {
  path: '/app',
  title: 'Loading… | 1st Class Express',
  description: 'Loading 1st Class Express.',
}
const appShellHtml = applyMarkup(
  applyMetadata(template, appShellRoute, { indexable: false, canonical: false }),
  '',
)
if (!appShellHtml.includes('noindex, nofollow') || appShellHtml.includes('rel="canonical"')) {
  throw new Error('app.html must be noindex and must not declare a canonical URL')
}
if (!/<div id="root"><\/div>/.test(appShellHtml)) {
  throw new Error('app.html must ship an empty #root so the browser renders the route')
}
await writeFile(path.join(outputRoot, 'app.html'), appShellHtml)

console.log(
  `Generated ${publicRoutes.length} indexable route documents, 404.html and app.html`,
)
