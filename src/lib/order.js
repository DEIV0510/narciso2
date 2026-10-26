// Proceso de pago. Hoy Narciso Parfum cobra por transferencia o Addi y cierra
// cada pedido por WhatsApp: no existe pasarela integrada, así que el sitio
// NUNCA marca un pedido como pagado — solo lo envía para confirmación.
//
// Para conectar una pasarela (Wompi, Mercado Pago, Bold…), añadir un proveedor
// con la misma forma { id, label, submit(order) } que cree la transacción en
// el servidor y redirija al checkout del proveedor; el pedido solo debe darse
// por pagado cuando el webhook del proveedor lo confirme.
import { brand, payment, shippingFlat, waLink } from '../data/site'
import { formatCOPLong } from './format'
import { DEFAULT_SIZE_LABEL } from '../context/CartContext'
import { longName } from './product'
import { SHOW_PRICES } from '../data/products'

export function buildOrderMessage(items, customer, { promo = null } = {}) {
  const lines = items.map((item) => {
    const size = item.sizeLabel && item.sizeLabel !== DEFAULT_SIZE_LABEL ? ` · ${item.sizeLabel}` : ''
    return `• ${item.qty} × ${longName(item)}${size}${SHOW_PRICES ? ` — ${formatCOPLong(item.price * item.qty)}` : ''}`
  })
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const method = payment.methods.find((m) => m.id === customer.paymentMethod)

  return [
    `Hola, ${brand.name}. Quiero realizar este pedido:`,
    '',
    ...lines,
    '',
    SHOW_PRICES ? `Subtotal: ${formatCOPLong(subtotal)}` : null,
    promo ? `Quiero aplicar la promoción ${promo.units} fragancias por ${formatCOPLong(promo.price)}.` : null,
    ...(!SHOW_PRICES
      ? ['Precio y envío: por confirmar según mi ciudad.']
      : shippingFlat == null
      ? ['Envío: por confirmar según mi ciudad.']
      : [`Envío: ${formatCOPLong(shippingFlat)}`, `Total: ${formatCOPLong(subtotal + shippingFlat)}`]),
    '',
    'Mis datos:',
    `Nombre: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Ciudad: ${customer.city}`,
    `Dirección: ${customer.address}${customer.neighborhood ? `, barrio ${customer.neighborhood}` : ''}`,
    customer.notes ? `Indicaciones: ${customer.notes}` : null,
    `Método de pago: ${method ? method.label : customer.paymentMethod}`,
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export const checkoutProviders = {
  whatsapp: {
    id: 'whatsapp',
    label: 'Confirmar pedido por WhatsApp',
    submit(message) {
      const url = waLink(message)
      // Sin 'noopener' en los features: con él window.open devuelve null
      // siempre y no se podría detectar un bloqueo de ventanas emergentes.
      const win = window.open(url, '_blank')
      if (win) win.opener = null
      else window.location.href = url
      return url
    },
  },
}
