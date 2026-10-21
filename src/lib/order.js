// Proceso de pago. Hoy Narciso Parfum cobra por transferencia o Addi y cierra
// cada pedido por WhatsApp: no existe pasarela integrada, así que el sitio
// NUNCA marca un pedido como pagado — solo lo envía para confirmación.
//
// Para conectar una pasarela (Wompi, Mercado Pago, Bold…), añadir un proveedor
// con la misma forma { id, label, submit(order) } que cree la transacción en
// el servidor y redirija al checkout del proveedor; el pedido solo debe darse
// por pagado cuando el webhook del proveedor lo confirme.
import { brand, payment, shipping, waLink } from '../data/site'
import { formatCOPLong } from './format'
import { DEFAULT_SIZE_LABEL } from '../context/CartContext'

export function buildOrderMessage(items, customer, { wantsPromo = false } = {}) {
  const lines = items.map((item) => {
    const size = item.sizeLabel && item.sizeLabel !== DEFAULT_SIZE_LABEL ? ` · ${item.sizeLabel}` : ''
    return `• ${item.qty} × ${item.title} (inspiración ${item.brand})${size} — ${formatCOPLong(item.price * item.qty)}`
  })
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const method = payment.methods.find((m) => m.id === customer.paymentMethod)

  return [
    `Hola, ${brand.name}. Quiero realizar este pedido:`,
    '',
    ...lines,
    '',
    `Subtotal: ${formatCOPLong(subtotal)}`,
    wantsPromo ? 'Quiero aplicar la promoción 3 fragancias por $130.000 COP.' : null,
    shipping.rate == null ? 'Envío: por confirmar según mi ciudad.' : null,
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
