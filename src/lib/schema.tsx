import { company } from '../data/company'

const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.1stclassexpress.com.au'

/** Emits a JSON-LD block. Rendered on the server too, so non-JS crawlers see it. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function BreadcrumbSchema({ label, path }: { label: string; path: string }) {
  return <JsonLd data={{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: label, item: `${siteUrl}${path}` },
    ],
  }} />
}

export function ServiceSchema({ items }: { items: readonly { id: string; title: string; short: string }[] }) {
  return <JsonLd data={{
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Freight and transport services',
    itemListElement: items.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${siteUrl}/services#${service.id}`,
        name: service.title,
        description: service.short,
        serviceType: service.title,
        areaServed: { '@type': 'Country', name: 'Australia' },
        provider: { '@type': 'Organization', name: company.name, url: siteUrl },
      },
    })),
  }} />
}

export function FaqSchema({ items }: { items: readonly { question: string; answer: string }[] }) {
  return <JsonLd data={{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }} />
}
