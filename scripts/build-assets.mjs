// Genera los recursos optimizados del sitio a partir de los originales reales
// de la marca en source-material/. Ninguna imagen es de banco ni generada: todo
// sale del logo oficial, del frasco real y de las fotos de producto del cliente.
//
//   npm run assets
//
// Salidas:
//   public/brand/   logo (fondo claro), logo invertido (fondo oscuro), emblema,
//                   favicons e imagen Open Graph.
//   public/img/hero frasco recortado con alfa + fondo de boutique desenfocado.
//   public/img/perfumes/<id>-640.{avif,webp} a partir de <id>.jpg (la foto
//                   original del cliente, 880–1100 px; las -1100.{avif,webp}
//                   ya vienen optimizadas del proyecto anterior). Para agregar
//                   un perfume: copiar su <id>.jpg aquí y correr este script.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..')
const SRC = path.join(ROOT, 'source-material')
const PUB = path.join(ROOT, 'public')
const BRAND = path.join(PUB, 'brand')
const HERO = path.join(PUB, 'img', 'hero')
const PERFUMES = path.join(PUB, 'img', 'perfumes')

for (const dir of [BRAND, HERO, PERFUMES]) fs.mkdirSync(dir, { recursive: true })

const IVORY = [245, 240, 231]

// Fondo blanco del logo oficial -> transparencia (umbral por luminancia con
// borde suavizado). Mismo criterio que el proyecto anterior.
async function makeTransparent(input, { threshold = 242, feather = 18 } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += info.channels) {
    const l = (data[i] + data[i + 1] + data[i + 2]) / 3
    if (l >= threshold) data[i + 3] = 0
    else if (l >= threshold - feather) data[i + 3] = Math.round(255 * ((threshold - l) / feather))
  }
  return { data, info }
}

// Versión para fondos oscuros: el relleno negro de la palabra NARCISO se vuelve
// marfil, conservando el bisel dorado y el emblema tal cual. Solo se toca la
// franja del texto (por debajo del corte del emblema) y solo píxeles oscuros y
// poco saturados — el dorado nunca cambia.
function reverseWordmark({ data, info }, cutRatio) {
  const out = Buffer.from(data)
  const startRow = Math.round(info.height * cutRatio)
  for (let y = startRow; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels
      if (out[i + 3] === 0) continue
      const r = out[i], g = out[i + 1], b = out[i + 2]
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      const l = (r + g + b) / 3
      // Croma absoluto (no saturación relativa: en los negros casi puros un
      // matiz mínimo da saturación alta). Neutro (relleno negro y sus brillos
      // grises) -> marfil plano; dorado (croma alto) -> intacto.
      const chroma = max - min
      const t = Math.min(1, Math.max(0, (48 - chroma) / 26))
      if (t === 0) continue
      const shade = 0.93 + 0.07 * (l / 255)
      out[i] = Math.round(r * (1 - t) + IVORY[0] * shade * t)
      out[i + 1] = Math.round(g * (1 - t) + IVORY[1] * shade * t)
      out[i + 2] = Math.round(b * (1 - t) + IVORY[2] * shade * t)
    }
  }
  return { data: out, info }
}

const raw = ({ data, info }) => sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })

async function brandAssets() {
  const trimmed = await sharp(path.join(SRC, 'logo-oficial.png')).flatten({ background: '#ffffff' }).trim({ threshold: 8 }).png().toBuffer()
  const meta = await sharp(trimmed).metadata()
  const transparent = await makeTransparent(trimmed)
  // 0.70 = hueco real entre el emblema y la palabra NARCISO (medido fila por
  // fila en el proyecto anterior sobre este mismo archivo).
  const CUT = 0.7
  const reversed = reverseWordmark(transparent, CUT)

  const write = async (img, name, height) => {
    const base = img.clone().resize({ height, withoutEnlargement: true })
    await base.clone().webp({ quality: 90, alphaQuality: 92 }).toFile(path.join(BRAND, `${name}.webp`))
    await base.clone().png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(path.join(BRAND, `${name}.png`))
  }
  const lightPng = await raw(transparent).png().toBuffer()
  const darkPng = await raw(reversed).png().toBuffer()
  await write(sharp(lightPng), 'logo', 360)
  await write(sharp(darkPng), 'logo-reverse', 360)
  // Versión liviana (~19 KB) para la pantalla de carga, que se pinta antes que todo.
  await sharp(darkPng).resize({ height: 168 }).webp({ quality: 70, alphaQuality: 80, effort: 6 }).toFile(path.join(BRAND, 'logo-intro.webp'))

  const crownH = Math.round(meta.height * CUT)
  const crownArea = await sharp(lightPng).extract({ left: 0, top: 0, width: meta.width, height: crownH }).png().toBuffer()
  const crown = await sharp(crownArea).trim({ threshold: 1 }).png().toBuffer()
  await write(sharp(crown), 'emblem', 240)

  const crownOnInk = (size) =>
    sharp(crown)
      .resize(Math.round(size * 0.78), Math.round(size * 0.78), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: Math.round(size * 0.11), bottom: size - Math.round(size * 0.78) - Math.round(size * 0.11), left: Math.round(size * 0.11), right: size - Math.round(size * 0.78) - Math.round(size * 0.11), background: { r: 16, g: 16, b: 16, alpha: 1 } })
      .flatten({ background: '#101010' })
  await crownOnInk(32).png().toFile(path.join(PUB, 'favicon-32.png'))
  await crownOnInk(180).png().toFile(path.join(PUB, 'apple-touch-icon.png'))
  await crownOnInk(512).png().toFile(path.join(PUB, 'icon-512.png'))

  return { darkPng }
}

async function heroAssets() {
  const bottle = await sharp(path.join(SRC, 'botella-oficial.png')).trim({ threshold: 1 }).png().toBuffer()
  for (const h of [1400, 760]) {
    const img = sharp(bottle).resize({ height: h, withoutEnlargement: true })
    await img.clone().avif({ quality: 60, effort: 6 }).toFile(path.join(HERO, `bottle-${h}.avif`))
    await img.clone().webp({ quality: 84, alphaQuality: 90 }).toFile(path.join(HERO, `bottle-${h}.webp`))
  }
  const bMeta = await sharp(path.join(HERO, 'bottle-1400.webp')).metadata()
  console.log('bottle-1400', bMeta.width, bMeta.height)

  // Estantería real de esencias (mitad superior de la foto de ambiente),
  // desenfocada y oscurecida: el bokeh dorado del fondo del hero.
  const amb = path.join(SRC, 'botella-oficial-ambiente.png')
  const aMeta = await sharp(amb).metadata()
  const bokeh = sharp(amb)
    .extract({ left: 0, top: 0, width: aMeta.width, height: Math.round(aMeta.height * 0.55) })
    .resize({ width: 900 })
    .blur(14)
    .modulate({ brightness: 0.55, saturation: 0.9 })
  await bokeh.clone().avif({ quality: 45 }).toFile(path.join(HERO, 'bokeh.avif'))
  await bokeh.clone().webp({ quality: 62 }).toFile(path.join(HERO, 'bokeh.webp'))
  return { bottle }
}

async function ogImage({ darkPng }, { bottle }) {
  const W = 1200, H = 630
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="g" cx="72%" cy="58%" r="55%"><stop offset="0" stop-color="#5a4426"/><stop offset=".45" stop-color="#22190f"/><stop offset="1" stop-color="#0b0a09"/></radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="0" y="${H - 120}" width="${W}" height="120" fill="#0b0a09" opacity=".6"/>
  </svg>`)
  const bottleImg = await sharp(bottle).resize({ height: 540 }).png().toBuffer()
  const bm = await sharp(bottleImg).metadata()
  const logoImg = await sharp(darkPng).resize({ height: 300 }).png().toBuffer()
  const lm = await sharp(logoImg).metadata()
  await sharp(bg)
    .composite([
      { input: logoImg, left: Math.round(300 - lm.width / 2), top: Math.round((H - lm.height) / 2) },
      { input: bottleImg, left: Math.round(840 - bm.width / 2), top: H - bm.height - 30 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(BRAND, 'og-image.jpg'))
}

async function productAssets() {
  const dir = PERFUMES
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg'))
  let done = 0
  await Promise.all(
    Array.from({ length: 6 }, async (_, worker) => {
      for (let i = worker; i < files.length; i += 6) {
        const id = files[i].replace(/\.jpg$/, '')
        const src = path.join(dir, files[i])
        const target640 = path.join(PERFUMES, `${id}-640.avif`)
        if (!fs.existsSync(target640)) {
          const img = sharp(src).resize({ width: 640 })
          await img.clone().avif({ quality: 55, effort: 5 }).toFile(target640)
          await img.clone().webp({ quality: 80 }).toFile(path.join(PERFUMES, `${id}-640.webp`))
        }
        const big = path.join(PERFUMES, `${id}-1100.avif`)
        if (!fs.existsSync(big)) {
          const img = sharp(src).resize({ width: 1100, withoutEnlargement: true })
          await img.clone().avif({ quality: 58, effort: 5 }).toFile(big)
          await img.clone().webp({ quality: 84 }).toFile(path.join(PERFUMES, `${id}-1100.webp`))
        }
        done++
      }
    })
  )
  console.log(`perfumes: ${done}`)
}

const brand = await brandAssets()
const hero = await heroAssets()
await ogImage(brand, hero)
await productAssets()
console.log('listo')
