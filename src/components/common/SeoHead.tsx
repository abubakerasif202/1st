import { useEffect } from 'react'
import { company } from '../../data/company'

const base = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.1stclassexpress.com.au'
const socialImage = `${base}/images/replacement/social-card.jpg`
// Typed as Organization rather than LocalBusiness: LocalBusiness requires a
// verified postal address, and publishing a guessed one is worse than omitting
// the type. Add "address" (PostalAddress) plus openingHoursSpecification and
// re-add "LocalBusiness" to @type once the trading address is confirmed.
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${base}/#organization`,
  name: company.name,
  legalName: '1st Class Express Pty Ltd',
  url: base,
  knowsAbout: ['Freight transport', 'Interstate linehaul', 'Dedicated drivers', 'Fleet management'],
  logo: `${base}/brand/first-class-express-logo.webp`,
  image: socialImage,
  description: 'Australian-owned freight delivery, professional driver and fleet-management services across metropolitan, regional and interstate routes.',
  foundingDate: '2013',
  telephone: company.phonePrimary,
  email: company.email,
  areaServed: ['Australia', ...company.serviceAreas].map(name => ({ '@type': 'AdministrativeArea', name })),
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: company.phonePrimary,
    contactType: 'customer service',
    areaServed: 'AU',
    availableLanguage: 'English',
  },
}
export function SeoHead({ title, description, path = '/', noIndex = false }: { title: string; description: string; path?: string; noIndex?: boolean }) {
  useEffect(() => {
    document.title = title
    const setMeta = (key: string, value: string, property = false) => {
      const selector = property ? `meta[property="${key}"]` : `meta[name="${key}"]`
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) { element = document.createElement('meta'); element.setAttribute(property ? 'property' : 'name', key); document.head.appendChild(element) }
      element.content = value
    }
    setMeta('description', description)
    setMeta('og:title', title, true); setMeta('og:description', description, true); setMeta('og:type', 'website', true)
    setMeta('og:url', `${base}${path}`, true); setMeta('og:site_name', '1st Class Express', true); setMeta('og:locale', 'en_AU', true); setMeta('og:image', socialImage, true)
    setMeta('twitter:card', 'summary_large_image'); setMeta('twitter:title', title); setMeta('twitter:description', description); setMeta('twitter:image', socialImage)
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (noIndex) {
      canonical?.remove()
    } else {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
      canonical.href = `${base}${path}`
    }
  }, [title, description, path, noIndex])
  return <script data-business-schema type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}/>
}
