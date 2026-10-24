import { useLocation } from 'react-router-dom'
import { IconWhatsApp } from './Icons'
import { waLink, waMessages } from '../data/site'
import { useCart } from '../context/CartContext'
import './WhatsAppFloat.css'

// Acceso directo a asesoría. En la ficha de producto, por debajo de 1000 px, sube para no
// tapar la barra fija de compra; con el carrito abierto se oculta.
export default function WhatsAppFloat() {
  const { pathname } = useLocation()
  const { view } = useCart()
  const onProduct = pathname.startsWith('/perfumes/')
  return (
    <a
      className={`wafloat ${onProduct ? 'wafloat--raised' : ''} ${view !== 'closed' ? 'is-hidden' : ''}`}
      href={waLink(waMessages.hello)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Asesoría por WhatsApp"
    >
      <IconWhatsApp />
    </a>
  )
}
