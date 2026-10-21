// Datos reales de Narciso Parfum. Única fuente de verdad para marca, contacto,
// envíos y pagos. Origen de cada dato:
//  - Contacto, dirección y redes: proyecto anterior (confirmados por el cliente).
//  - "Eau de parfum / vaporisateur", "Especialistas en inspiración" y
//    "Elaborado en Ibagué Tolima": etiqueta impresa en el frasco real
//    (source-material/botella-oficial.png).
//  - "Fragancias que te definen", "Tu esencia, tu historia", "Más que un
//    perfume, una actitud" y "Envíos a toda Colombia": pieza oficial de la
//    promoción (source-material/promo-especial.png).
//  - Addi (hasta 3 cuotas, 0% de interés): banner oficial de Addi del cliente.
// Lo que NO existe todavía se deja en null y la interfaz lo omite (no se
// inventa): tarifa de envío, pasarela de pago, inventario.

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://narcisoparfum.com').replace(/\/$/, '')

export const brand = {
  name: 'Narciso Parfum',
  legalLine: 'Especialistas en inspiración',
  taglines: {
    primary: 'Fragancias que te definen',
    story: 'Tu esencia, tu historia',
    attitude: 'Más que un perfume, una actitud',
  },
  // Presentación real del frasco Narciso (etiqueta): todas las fragancias se
  // envasan igual. El tamaño y el precio viven en products.js.
  productFormat: 'Eau de parfum',
  city: 'Ibagué, Tolima',
  whatsapp: '573229282884',
  whatsappDisplay: '322 928 2884',
  instagramUrl: 'https://www.instagram.com/narcisoparfumoficial',
  instagramHandle: '@narcisoparfumoficial',
  tiktokUrl: 'https://www.tiktok.com/@narciso.parfum.of',
  tiktokHandle: '@narciso.parfum.of',
  address: {
    line1: 'Urbanización Santa Ana, Manzana 34 Casa 2',
    line2: 'Ibagué, Tolima, Colombia',
    full: 'Urbanización Santa Ana, Manzana 34 Casa 2, Ibagué, Tolima, Colombia',
  },
}

export const shipping = {
  coverage: 'Envíos a toda Colombia',
  // Tarifa real aún no definida por el cliente: se confirma por WhatsApp según
  // la ciudad. Cuando exista, poner aquí { flat: 12000 } o una tabla por ciudad
  // y el carrito la sumará automáticamente (ver CartDrawer / cart.js).
  rate: null,
  pendingNote: 'El costo de envío se confirma por WhatsApp según tu ciudad.',
}

export const payment = {
  methods: [
    { id: 'transferencia', label: 'Transferencia bancaria', detail: 'Te enviamos los datos de la cuenta al confirmar el pedido.' },
    { id: 'addi', label: 'Addi', detail: 'Hasta 3 cuotas · 0% de interés' },
  ],
  addi: { installments: 3, interest: '0% de interés' },
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address.full)}`

export function waLink(message) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`
}

export const waMessages = {
  hello: 'Hola, Narciso Parfum. Quiero asesoría para elegir mi fragancia.',
  product: (name, size, price) =>
    `Hola, Narciso Parfum. Quiero comprar la fragancia ${name}${size ? ` (${size})` : ''}${price ? ` por ${price}` : ''}. ¿Me confirman disponibilidad?`,
  addi: (name) =>
    name
      ? `Hola, Narciso Parfum. Quiero comprar ${name} y pagar con Addi (hasta 3 cuotas, 0% de interés). ¿Me ayudan?`
      : 'Hola, Narciso Parfum. Quiero hacer un pedido y pagar con Addi (hasta 3 cuotas, 0% de interés). ¿Me ayudan?',
  promo: 'Hola, Narciso Parfum. Vi la promoción especial (elige 3 fragancias por $130.000 COP) y quiero armar mi combo.',
  visit: 'Hola, Narciso Parfum. Quiero visitarlos en Ibagué. ¿Me confirman horario?',
}

// Hechos reales de la marca (confirmados por el cliente en el proyecto anterior).
export const houseFacts = [
  { title: 'Perfumería de alta calidad', text: 'Fragancias en Eau de parfum, envasadas en el frasco negro mate de la casa.' },
  { title: 'Especialistas en inspiración', text: 'Cada esencia toma como referencia una fragancia icónica y su pirámide olfativa.' },
  { title: 'Elaborado en Ibagué, Tolima', text: 'Medimos, mezclamos y envasamos en nuestro taller.' },
  { title: 'Atención personalizada', text: 'Te asesoramos por WhatsApp para encontrar tu fragancia.' },
]
