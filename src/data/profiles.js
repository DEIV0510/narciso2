// Perfiles olfativos para explorar el catálogo. La pertenencia de cada perfume
// se calcula SOLO con datos verificados de fragranceInfo.js (familia olfativa y
// ocasiones), nunca a mano: un perfume puede estar en varios perfiles (una
// "Amaderada especiada" aparece en Amaderados y en Especiados). Los 3 productos
// sin ficha verificada no entran en ningún perfil.
import { products } from './products'
import { getFragranceInfo } from './fragranceInfo'

export function normalize(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// `theme` alimenta la dirección de arte (fondos y luces de tarjetas y fichas).
export const PROFILES = [
  {
    key: 'frescos',
    label: 'Frescos y cítricos',
    short: 'Frescos',
    lead: 'Bergamota, limón y notas marinas. Luz limpia para el día.',
    match: (fam) => /citric|acuatic|marin|fresc|verde/.test(fam),
  },
  {
    key: 'gourmand',
    label: 'Dulces y gourmand',
    short: 'Gourmand',
    lead: 'Vainilla, caramelo y praliné. Calidez que se queda en la piel.',
    match: (fam) => /gourmand|vainill|dulce/.test(fam),
  },
  {
    key: 'amaderados',
    label: 'Amaderados',
    short: 'Amaderados',
    lead: 'Cedro, sándalo y vetiver. Profundidad serena.',
    match: (fam) => /amaderad|madera/.test(fam),
  },
  {
    key: 'especiados',
    label: 'Especiados',
    short: 'Especiados',
    lead: 'Canela, pimienta y cardamomo. Carácter cálido y magnético.',
    match: (fam) => /especiad/.test(fam),
  },
  {
    key: 'ambar',
    label: 'Ámbar y orientales',
    short: 'Orientales',
    lead: 'Ámbar, resinas y oud. Opulencia nocturna de estela intensa.',
    match: (fam) => /oriental|ambar/.test(fam),
  },
  {
    key: 'aromaticos',
    label: 'Aromáticos',
    short: 'Aromáticos',
    lead: 'Lavanda, romero y salvia. Frescura herbal de espíritu clásico.',
    match: (fam) => /aromatic|fougere/.test(fam),
  },
  {
    key: 'florales',
    label: 'Florales',
    short: 'Florales',
    lead: 'Jazmín, rosa y azahar. Romanticismo luminoso o sensual.',
    match: (fam) => /floral/.test(fam),
  },
  {
    key: 'especiales',
    label: 'Para ocasiones especiales',
    short: 'Ocasiones especiales',
    lead: 'Recomendadas para eventos y noches que se recuerdan.',
    match: (_fam, info) => info.occasions?.includes('Evento'),
  },
]

export const PROFILE_BY_KEY = Object.fromEntries(PROFILES.map((p) => [p.key, p]))

export function productProfiles(product) {
  const info = getFragranceInfo(product.id)
  if (!info) return []
  const fam = normalize(info.family)
  return PROFILES.filter((p) => p.match(fam, info)).map((p) => p.key)
}

const profileIndex = new Map(products.map((p) => [p.id, productProfiles(p)]))

export function hasProfile(product, key) {
  return profileIndex.get(product.id)?.includes(key) ?? false
}

export function productsByProfile(key, list = products) {
  return list.filter((p) => hasProfile(p, key))
}

export const profileCounts = Object.fromEntries(PROFILES.map((p) => [p.key, productsByProfile(p.key).length]))

// Tema visual de un perfume según la PRIMERA palabra de su familia (la
// dominante): "Oriental floral" se ilumina como oriental, "Floral oriental"
// como floral. Gourmand/vainilla manda sobre todo lo demás.
const THEME_BY_TOKEN = [
  [/gourmand|vainill/, 'gourmand'],
  [/^amaderad|^madera|^chipre|^cuero/, 'amaderados'],
  [/^oriental|^ambar/, 'ambar'],
  [/^floral|^almizcl|^frutal|^afrutad|^tropical/, 'florales'],
  [/^aromatic|^fougere/, 'aromaticos'],
  [/^citric|^acuatic|^marin|^fresc|^verde/, 'frescos'],
  [/^especiad|^dulce/, 'especiados'],
]

export function productTheme(product) {
  const info = getFragranceInfo(product.id)
  if (!info) return 'especiales'
  const fam = normalize(info.family)
  for (const [re, theme] of THEME_BY_TOKEN) if (re.test(fam)) return theme
  return 'especiales'
}

export const GENDERS = [
  { key: 'hombre', label: 'Hombre', plural: 'Para él' },
  { key: 'mujer', label: 'Mujer', plural: 'Para ella' },
  { key: 'unisex', label: 'Unisex', plural: 'Para todos' },
]
export const GENDER_BY_KEY = Object.fromEntries(GENDERS.map((g) => [g.key, g]))
