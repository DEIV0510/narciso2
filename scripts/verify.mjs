// Verificación automática: corre al final de `npm run build` y detiene la
// compilación si algo está mal, para que ningún error llegue a producción.
//
//   node scripts/verify.mjs          (requiere dist/ ya generado)
//
// 1. Datos: catálogo, fotos, precios, fichas, destacados.
// 2. Sitio generado (dist/): páginas, enlaces internos, imágenes y recursos
//    referenciados, sitemap, títulos/descripciones únicos, JSON-LD válido.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const PUB = path.join(ROOT, 'public')
const imp = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href)

const errors = []
const warnings = []
const err = (m) => errors.push(m)
const warn = (m) => warnings.push(m)

// ── 1. Datos ────────────────────────────────────────────────────────────────
const { CATALOG } = await imp('src/data/catalog.js')
const { products, SIZES, SHOW_COMMERCIAL_NAMES } = await imp('src/data/products.js')
const { getFragranceInfo } = await imp('src/data/fragranceInfo.js')
const { FEATURED_IDS } = await imp('src/data/featured.js')
const { promotions } = await imp('src/data/promotions.js')

const GENDERS = new Set(['mujer', 'hombre', 'unisex'])
const OCC = new Set(['Día a día', 'Trabajo', 'Salida', 'Cita', 'Noche', 'Evento', 'Deporte'])
const SEASONS = new Set(['Primavera', 'Verano', 'Otoño', 'Invierno'])
const TIMES = new Set(['Día', 'Tarde', 'Noche'])
// Fichas que no se publican a propósito (sin fuente fiable, ver README).
const KNOWN_WITHOUT_INFO = new Set(['eros-pour-femme-versace-mujer', 'vega-ahli-unisex', 'arrurru-arrurru-unisex'])

const seenIds = new Set()
const seenCodes = new Set()
for (const r of CATALOG) {
  const tag = `${r.code || '?'} (${r.id || 'sin id'})`
  if (!r.id || !/^[a-z0-9-]+$/.test(r.id)) err(`Catálogo: id inválido en ${tag}`)
  if (seenIds.has(r.id)) err(`Catálogo: id repetido ${r.id}`)
  seenIds.add(r.id)
  if (!r.code) err(`Catálogo: falta código en ${tag}`)
  if (seenCodes.has(r.code)) err(`Catálogo: código repetido ${r.code}`)
  seenCodes.add(r.code)
  if (!GENDERS.has(r.gender)) err(`Catálogo: sección inválida "${r.gender}" en ${tag}`)
  if (!r.title?.trim() || !r.brand?.trim()) err(`Catálogo: falta perfume o casa en ${tag}`)
  if (SHOW_COMMERCIAL_NAMES && !r.commercialName?.trim()) err(`Catálogo: falta nombre comercial en ${tag}`)
  const img = r.image || r.id
  if (img !== 'catalog-bottle') {
    for (const suffix of ['.jpg', '-640.avif', '-640.webp', '-1100.avif', '-1100.webp']) {
      if (!fs.existsSync(path.join(PUB, 'img/perfumes', img + suffix))) err(`Foto: falta img/perfumes/${img}${suffix} (${tag})`)
    }
  } else {
    warn(`Sin foto propia (usa el frasco recortado): ${tag}`)
  }
}

if (!SIZES.length || SIZES.some((s) => !s.label || !(s.price > 0))) err('Precios: SIZES vacío o con precios inválidos')
for (const p of products) {
  if (!(p.price > 0)) err(`Precio inválido en ${p.id}`)
  const info = getFragranceInfo(p.id)
  if (!info) {
    if (!KNOWN_WITHOUT_INFO.has(p.id)) err(`Ficha: ${p.id} no tiene ficha olfativa`)
    continue
  }
  for (const k of ['family', 'profile']) if (!info[k]?.trim()) err(`Ficha ${p.id}: falta ${k}`)
  // El perfil se muestra como descripción del producto Narciso: no puede
  // prometer duraciones, concentraciones ni usos del original, ni traer notas
  // internas de investigación.
  if (/horas|\d+\s?%|extrait|concentraci|eau de (toilette|parfum)|fragrantica|según|\bbrumas?\b|body mist|desglosa|pirámide|descripción oficial|sin alcohol|piel(es)? sensible/i.test(info.profile || '')) {
    err(`Ficha ${p.id}: el perfil afirma duración, concentración o trae notas de investigación`)
  }
  // Hay casas que publican las notas sin niveles: basta con que haya notas.
  for (const k of ['topNotes', 'heartNotes', 'baseNotes']) if (!Array.isArray(info[k])) err(`Ficha ${p.id}: ${k} no es una lista`)
  if (![...(info.topNotes || []), ...(info.heartNotes || []), ...(info.baseNotes || [])].length) err(`Ficha ${p.id}: no tiene notas`)
  for (const o of info.occasions || []) if (!OCC.has(o)) err(`Ficha ${p.id}: ocasión desconocida "${o}"`)
  for (const s of info.season || []) if (!SEASONS.has(s)) err(`Ficha ${p.id}: estación desconocida "${s}"`)
  for (const t of info.timeOfDay || []) if (!TIMES.has(t)) err(`Ficha ${p.id}: momento desconocido "${t}"`)
}
for (const id of FEATURED_IDS) if (!seenIds.has(id)) err(`Destacados: ${id} no está en el catálogo`)
for (const promo of promotions) {
  for (const k of ['id', 'title', 'units', 'price', 'includes', 'conditions', 'whatsappMessage']) {
    if (promo[k] == null || promo[k] === '') err(`Promoción ${promo.id || '?'}: falta ${k}`)
  }
}

// ── 2. Sitio generado ───────────────────────────────────────────────────────
if (!fs.existsSync(DIST)) {
  err('No existe dist/: corre primero vite build + prerender')
} else {
  // Mismas reglas que .htaccess / vercel.json / scripts/serve.mjs.
  const resolvePath = (urlPath) => {
    const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]).replace(/\/+$/, '') || '/'
    const base = path.join(DIST, clean)
    return [base, path.join(base, 'index.html'), `${base}.html`].find((c) => fs.existsSync(c) && fs.statSync(c).isFile())
  }
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
  const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'))

  for (const r of CATALOG) if (!fs.existsSync(path.join(DIST, 'perfumes', `${r.id}.html`))) err(`Falta la página perfumes/${r.id}.html`)
  for (const f of ['index.html', 'perfumes/index.html', '404.html', 'sitemap.xml', 'robots.txt', '.htaccess', 'assets/.htaccess']) {
    if (!fs.existsSync(path.join(DIST, f))) err(`Falta dist/${f}`)
  }

  const titles = new Map()
  const descs = new Map()
  const checked = new Set()
  for (const file of htmlFiles) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/')
    const html = fs.readFileSync(file, 'utf8')
    if (!html.includes('<div id="root">') || html.includes('<!--app-html-->') || html.includes('<!--app-head-->')) {
      err(`${rel}: el prerender no reemplazó las marcas de la plantilla`)
    }
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
    if (!title) err(`${rel}: sin <title>`)
    if (!desc) err(`${rel}: sin meta description`)
    if (rel !== '404.html') {
      if (titles.has(title)) err(`Título repetido: "${title}" (${rel} y ${titles.get(title)})`)
      if (descs.has(desc)) err(`Descripción repetida en ${rel} y ${descs.get(desc)}`)
      titles.set(title, rel)
      descs.set(desc, rel)
    }
    // Texto visible: conjunción "e" ante /i/ y sin la promoción retirada.
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '')
    if (/\sy [Ii]nvierno/.test(text)) err(`${rel}: dice "y invierno" (debe ser "e invierno")`)
    if (/130\.000/.test(text)) err(`${rel}: menciona la promoción retirada de $130.000`)
    if (/Notas de Notas/i.test(html)) err(`${rel}: dice "Notas de Notas"`)
    // Una nota repetida en la misma tarjeta ("Lavanda · Lavanda").
    for (const m of text.matchAll(/class="pcard__notes">([\s\S]*?)<\/p>/g)) {
      const list = m[1].replace(/<[^>]+>/g, '').replace(/^Notas principales:\s*/, '').split(' · ')
      if (new Set(list).size !== list.length) err(`${rel}: nota repetida en una tarjeta (${list.join(' · ')})`)
    }
    // Un ancla (/#perfil) nunca es la página actual.
    if (/<a[^>]*aria-current="page"[^>]*href="\/#/.test(html)) err(`${rel}: un enlace a una sección lleva aria-current="page"`)
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(m[1])
      } catch {
        err(`${rel}: JSON-LD inválido`)
      }
    }
    const refs = [
      ...[...html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/\s(?:srcset|srcSet|imagesrcset)="([^"]*)"/g)].flatMap((m) =>
        m[1].split(',').map((s) => s.trim().split(/\s+/)[0])
      ),
    ].filter((u) => u.startsWith('/') && !u.startsWith('//'))
    for (const u of refs) {
      const key = u.split(/[?#]/)[0]
      if (checked.has(key)) continue
      checked.add(key)
      if (!resolvePath(key)) err(`${rel}: enlace o recurso roto ${key}`)
    }
  }

  // La precarga del frasco del hero debe pedir el mismo candidato que el <picture>.
  const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  const preSizes = home.match(/imagesizes="([^"]*)"/)?.[1]
  const picSizes = home.match(/<source type="image\/avif" srcSet="\/img\/hero[^"]*" sizes="([^"]*)"/)?.[1]
  if (!preSizes || preSizes !== picSizes) err(`index.html: la precarga del frasco (${preSizes}) no coincide con el <picture> (${picSizes})`)

  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
  const locs = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
  for (const loc of locs) if (!resolvePath(loc)) err(`sitemap.xml: ${loc} no existe en dist`)
  if (locs.length !== CATALOG.length + 2) err(`sitemap.xml: ${locs.length} URLs (se esperaban ${CATALOG.length + 2})`)
}

for (const w of warnings) console.warn(`  aviso: ${w}`)
if (errors.length) {
  console.error(`\nverificación: ${errors.length} error(es)`)
  for (const e of errors.slice(0, 60)) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log(`verificación: OK (${CATALOG.length} fragancias, ${warnings.length} aviso(s))`)
