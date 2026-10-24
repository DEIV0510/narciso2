// Catálogo real de Narciso Parfum. La lista de fragancias, su orden y su
// sección vienen de catalog.js (Excel del cliente, 2026-10-23); aquí solo se
// arma cada producto con sus presentaciones y precios. El historial de cargas
// anteriores (fotos por lote, correcciones de nombres) quedó documentado en el
// repositorio anterior (DEIV0510/narciso) y en el README.
import { CATALOG } from './catalog'

export const CATEGORIES = {
  hombre: 'Perfumería Caballero',
  mujer: 'Perfumería Dama',
  unisex: 'Perfumería Unisex',
}

// Presentaciones y precios reales dados por el cliente (2026-10-23): todo el
// catálogo se vende en 50 ml a $40.000 y 100 ml a $60.000 COP, sin
// excepciones. `price` es el precio "desde" (la presentación más pequeña).
export const SIZES = [
  { label: '50 ml', price: 40000 },
  { label: '100 ml', price: 60000 },
]

// Cada fragancia se muestra con su nombre comercial Narciso del Excel
// (commercialName) y, debajo, "Inspirado en <perfume> de <casa>". El cliente
// pidió publicarlos tal como los mandó (2026-10-24), aunque algunos se repitan
// entre perfumes distintos; la lista de observaciones está en
// docs/revision-catalogo.md. Con `false` se vuelve a mostrar solo el nombre del
// perfume original.
export const SHOW_COMMERCIAL_NAMES = true

function toProduct(row) {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    brand: row.brand,
    ...(SHOW_COMMERCIAL_NAMES && row.commercialName ? { name: row.commercialName } : {}),
    commercialName: row.commercialName || null,
    fullName: `${row.title} by ${row.brand}`,
    price: SIZES[0].price,
    sizes: SIZES,
    category: CATEGORIES[row.gender],
    gender: row.gender,
    image: row.image || row.id,
  }
}

export const products = CATALOG.map(toProduct)

const byId = new Map(products.map((p) => [p.id, p]))

export function getProductById(id) {
  return byId.get(id) || null
}
