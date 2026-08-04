import { useEffect } from 'react'

const base = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.1stclassexpress.com.au'
export function SeoHead({ title, description, path = '/' }: { title: string; description: string; path?: string }) {
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
    setMeta('og:url', `${base}${path}`, true); setMeta('twitter:card', 'summary_large_image')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${base}${path}`
  }, [title, description, path])
  return null
}
