// Promociones comerciales reales. Hoy no hay ninguna activa: la de "3
// fragancias por $130.000" (source-material/promo-especial.png) se retiró por
// decisión del cliente (2026-10-21, reconfirmado 2026-10-23: "sin
// promoción"); con los precios nuevos, 3 fragancias de 50 ml ya cuestan
// $120.000.
//
// Con la lista vacía, el sitio no muestra ofertas: desaparecen el enlace
// "Promociones" del menú, el bloque de la portada y el aviso del carrito.
// Para publicar una promoción, añadir un objeto con esta forma (todo dato debe
// venir del cliente). `validUntil` (AAAA-MM-DD) es opcional: la vigencia se
// calcula con la fecha de la compilación, para que el HTML prerenderizado y la
// app coincidan; la promoción deja de verse en el primer build posterior a esa
// fecha, así que hay que recompilar y publicar el día siguiente al vencimiento:
//
// {
//   id: 'tres-por-x',
//   active: true,
//   eyebrow: 'Promoción especial',
//   title: 'Elige 3 fragancias',
//   units: 3,
//   price: 130000,
//   sizeLabel: '100 ml',          // presentación a la que aplica
//   unitPrice: 60000,             // precio individual real de esa presentación
//   includes: 'Tres fragancias de 100 ml de tu elección.',
//   conditions: ['…'],
//   validUntil: null,
//   whatsappMessage: 'Hola, Narciso Parfum. Vi la promoción…',
// }
export const promotions = []

// __BUILD_DATE__ lo define vite.config.js; fuera de Vite (scripts/verify.mjs)
// se usa la fecha actual.
const buildDate = typeof __BUILD_DATE__ !== 'undefined' ? new Date(__BUILD_DATE__) : new Date()

export const activePromotions = promotions.filter(
  (p) => p.active && (!p.validUntil || new Date(`${p.validUntil}T23:59:59-05:00`) >= buildDate)
)
