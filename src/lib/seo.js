// Metadatos por ruta. Se usan dos veces: en el prerender (scripts/prerender.mjs
// los escribe en el HTML estático de cada página) y en el navegador al navegar
// entre páginas (hooks/useDocumentMeta.js).
import { products, getProductById } from '../data/products'
import { getFragranceInfo } from '../data/fragranceInfo'
import { brand, SITE_URL } from '../data/site'
import { productImage } from './images'
import { displayName, reference } from './product'

const DEFAULT_IMAGE = '/brand/og-image.jpg'

export const HOME_META = {
  title: 'Narciso Parfum | Fragancias que te definen · Perfumería en Ibagué',
  description: `Boutique de perfumería de inspiración: ${products.length} fragancias para hombre, mujer y unisex en Eau de parfum de 50 y 100 ml. Elaboradas en Ibagué, Tolima, con envíos a toda Colombia y pago con Addi.`,
  path: '/',
}

export const CATALOG_META = {
  title: 'Catálogo de fragancias | Narciso Parfum',
  description: `Explora las ${products.length} fragancias de Narciso Parfum por género y perfil olfativo: frescas, gourmand, amaderadas, especiadas, orientales, aromáticas y florales.`,
  path: '/perfumes',
}

export const NOT_FOUND_META = {
  title: 'Página no encontrada | Narciso Parfum',
  description: 'La página que buscas no existe. Descubre nuestras fragancias.',
  path: '/404',
  noindex: true,
}

const abs = (p) => (p.startsWith('http') ? p : `${SITE_URL}${p}`)

function storeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: brand.name,
    url: `${SITE_URL}/`,
    image: abs(DEFAULT_IMAGE),
    logo: abs('/brand/logo.png'),
    slogan: brand.taglines.primary,
    telephone: `+${brand.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.line1,
      addressLocality: 'Ibagué',
      addressRegion: 'Tolima',
      addressCountry: 'CO',
    },
    sameAs: [brand.instagramUrl, brand.tiktokUrl],
  }
}

export function productMeta(product) {
  const info = getFragranceInfo(product.id)
  const sizes = product.sizes?.length ? product.sizes : [{ label: null, price: product.price }]
  const notes = info ? [...info.topNotes.slice(0, 2), ...info.heartNotes.slice(0, 1), ...info.baseNotes.slice(0, 1)] : []
  const familyText = info ? ` ${info.family.toLowerCase()}` : ''
  const name = displayName(product)
  const cop = (n) => `$${n.toLocaleString('es-CO')}`
  const priceText = sizes.map((s) => (s.label ? `${s.label} a ${cop(s.price)}` : cop(s.price))).join(' y ')
  const description = [
    `${name}: fragancia${familyText} de Narciso Parfum inspirada en ${reference(product)}.`,
    notes.length ? `Notas de ${notes.join(', ')}.` : '',
    `${brand.productFormat} en ${priceText} COP. Envíos a toda Colombia.`,
  ]
    .filter(Boolean)
    .join(' ')
  const path = `/perfumes/${product.id}`
  const img = productImage(product.image).og

  return {
    title: `${name} — inspirado en ${product.name ? reference(product) : product.brand} | Narciso Parfum`,
    description,
    path,
    image: img,
    type: 'product',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${name} — Narciso Parfum (inspirado en ${reference(product)})`,
        sku: product.id,
        image: [abs(img)],
        description: info?.profile || description,
        category: product.category,
        brand: { '@type': 'Brand', name: brand.name },
        // Una oferta por presentación (50 ml y 100 ml).
        offers: sizes.map((s) => ({
          '@type': 'Offer',
          ...(s.label ? { name: s.label } : {}),
          url: abs(path),
          price: String(s.price),
          priceCurrency: 'COP',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: brand.name },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: 'Fragancias', item: abs('/perfumes') },
          { '@type': 'ListItem', position: 3, name, item: abs(path) },
        ],
      },
    ],
  }
}

export function metaForPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/'
  if (clean === '/') return { ...HOME_META, jsonLd: [storeJsonLd()] }
  if (clean === '/perfumes') return CATALOG_META
  const m = clean.match(/^\/perfumes\/([^/]+)$/)
  if (m) {
    const product = getProductById(m[1])
    if (product) return productMeta(product)
  }
  return NOT_FOUND_META
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// HTML del <head> para el prerender.
export function renderHead(meta, { preload = [] } = {}) {
  const url = abs(meta.path === '/' ? '/' : meta.path)
  const image = abs(meta.image || DEFAULT_IMAGE)
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    meta.noindex ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${brand.name}" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:type" content="${meta.type === 'product' ? 'product' : 'website'}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...preload,
    ...(meta.jsonLd || []).map(
      (d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`
    ),
  ]
  return tags.filter(Boolean).join('\n    ')
}
