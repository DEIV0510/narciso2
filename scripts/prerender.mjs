// Prerender: convierte la SPA en un HTML real por ruta (inicio, catálogo, las
// fichas de los 283 perfumes y la 404) con su <title>, description, Open
// Graph, canonical y JSON-LD. Luego React hidrata en el navegador.
// También escribe sitemap.xml y robots.txt.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SSR = path.join(ROOT, 'dist-ssr', 'entry-server.js')

const { render, metaForPath, renderHead, products, BOTTLE_SRC, BOTTLE_SIZES } = await import(pathToFileURL(SSR).href)
const SITE_URL = (process.env.VITE_SITE_URL || 'https://narcisoparfum.com').replace(/\/$/, '')

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
// Mismas cadenas que el <picture> del hero (src/data/heroBottle.js).
const preloadHero = [
  `<link rel="preload" as="image" type="image/avif" imagesrcset="${BOTTLE_SRC.avif}" imagesizes="${BOTTLE_SIZES}" fetchpriority="high" />`,
]

function page(url, file, extra = {}) {
  const html = render(url)
  const head = renderHead(metaForPath(url), extra)
  const out = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
  const target = path.join(DIST, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, out)
}

const started = Date.now()
page('/', 'index.html', { preload: preloadHero })
page('/perfumes', 'perfumes/index.html')
for (const p of products) {
  const img = `/img/perfumes/${p.image}`
  // Sin foto propia no se precarga nada (el frasco recortado ya es liviano).
  const ownPhoto = p.image !== 'catalog-bottle'
  page(`/perfumes/${p.id}`, `perfumes/${p.id}.html`, {
    preload: ownPhoto
      ? [
          `<link rel="preload" as="image" type="image/avif" imagesrcset="${img}-640.avif 640w, ${img}-1100.avif 1100w" imagesizes="(min-width: 1000px) 520px, 88vw" fetchpriority="high" />`,
        ]
      : [],
  })
}
page('/404', '404.html')

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/perfumes', priority: '0.9', changefreq: 'weekly' },
  ...products.map((p) => ({
    loc: `/perfumes/${p.id}`,
    priority: '0.7',
    changefreq: 'monthly',
    image: p.image !== 'catalog-bottle' ? `/img/perfumes/${p.image}.jpg` : null,
  })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `\n    <image:image><image:loc>${SITE_URL}${u.image}</image:loc></image:image>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
fs.rmSync(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true })

console.log(`prerender: ${urls.length + 1} páginas en ${Date.now() - started} ms`)
