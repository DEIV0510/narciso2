import { useEffect } from 'react'
import { metaForPath } from '../lib/seo'
import { SITE_URL } from '../data/site'

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const meta = (key, value, attr = 'name') =>
  setTag(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  }, 'content', value)

// En el primer render el HTML prerenderizado ya trae todo; esto solo actualiza
// title/description/OG/canonical/JSON-LD al navegar dentro del sitio.
export default function useDocumentMeta(pathname) {
  useEffect(() => {
    const m = metaForPath(pathname)
    const url = `${SITE_URL}${m.path === '/' ? '/' : m.path}`
    document.title = m.title
    meta('description', m.description)
    meta('og:title', m.title, 'property')
    meta('og:description', m.description, 'property')
    meta('og:url', url, 'property')
    meta('og:image', `${SITE_URL}${m.image || '/brand/og-image.jpg'}`, 'property')
    meta('twitter:title', m.title)
    meta('twitter:description', m.description)
    meta('robots', m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    if (!m.noindex) {
      setTag('link[rel="canonical"]', () => {
        const l = document.createElement('link')
        l.rel = 'canonical'
        return l
      }, 'href', url)
    }
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove())
    for (const data of m.jsonLd || []) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.textContent = JSON.stringify(data)
      document.head.appendChild(s)
    }
  }, [pathname])
}
