// Promociones comerciales reales. Fuente: pieza oficial del cliente
// (source-material/promo-especial.png): "Promoción especial — elige 3
// fragancias por solo 3 x 130.000 COP".
//
// Para agregar una promoción: añadir un objeto a `promotions`. Para retirarla:
// `active: false` (la sección muestra entonces un estado "próximas ediciones"
// sin ofertas ficticias). `validUntil` (AAAA-MM-DD) se muestra solo si existe:
// el cliente no ha dado fecha de cierre, así que queda en null.
//
// Pendiente de confirmar con el cliente (no se muestra en el sitio): si el
// combo incluye Torino21 y Unstoppable Hong Kong, que se venden a $60.000.
export const promotions = [
  {
    id: 'tres-por-130',
    active: true,
    eyebrow: 'Promoción especial',
    title: 'Elige 3 fragancias',
    units: 3,
    price: 130000,
    // Precio individual real del catálogo (50 ml).
    unitPrice: 55000,
    includes: 'Tres fragancias de tu elección del catálogo Narciso Parfum.',
    conditions: [
      'Eliges las 3 fragancias y te confirmamos el combo por WhatsApp.',
      'Sujeto a disponibilidad de las fragancias elegidas.',
      'El costo de envío se confirma por WhatsApp según tu ciudad.',
    ],
    validUntil: null,
    whatsappMessage:
      'Hola, Narciso Parfum. Vi la promoción especial (elige 3 fragancias por $130.000 COP) y quiero armar mi combo.',
  },
]

export const activePromotions = promotions.filter(
  (p) => p.active && (!p.validUntil || new Date(`${p.validUntil}T23:59:59-05:00`) >= new Date())
)
