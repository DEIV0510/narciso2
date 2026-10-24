import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductImage from './ProductImage'
import { Emblem } from './Logo'
import { IconArrow, IconChevron, IconClose, IconMinus, IconPlus, IconTrash, IconWhatsApp, IconCheck } from './Icons'
import { useCart, DEFAULT_SIZE_LABEL } from '../context/CartContext'
import useDialog from '../hooks/useDialog'
import { payment, shipping } from '../data/site'
import { activePromotions } from '../data/promotions'
import { buildOrderMessage, checkoutProviders } from '../lib/order'
import { formatCOP } from '../lib/format'
import { displayName, inspiredBy } from '../lib/product'
import './CartDrawer.css'

const FIELDS = [
  { key: 'name', label: 'Nombre completo', type: 'text', autoComplete: 'name', required: true, wide: true },
  { key: 'phone', label: 'Celular', type: 'tel', autoComplete: 'tel', inputMode: 'tel', required: true },
  { key: 'city', label: 'Ciudad', type: 'text', autoComplete: 'address-level2', required: true },
  { key: 'address', label: 'Dirección', type: 'text', autoComplete: 'street-address', required: true, wide: true },
  { key: 'neighborhood', label: 'Barrio', type: 'text', autoComplete: 'off', required: true, wide: true },
]

const emptyCustomer = { name: '', phone: '', city: '', address: '', neighborhood: '', notes: '', paymentMethod: payment.methods[0].id }

function validate(customer) {
  const errors = {}
  for (const f of FIELDS) {
    if (f.required && !customer[f.key].trim()) errors[f.key] = 'Este dato es necesario para el envío.'
  }
  const digits = customer.phone.replace(/\D/g, '')
  if (!errors.phone && (digits.length < 7 || digits.length > 15)) errors.phone = 'Escribe un número de celular válido.'
  return errors
}

function QtyStepper({ item }) {
  const { setQty, removeItem, maxQty } = useCart()
  return (
    <div className="qty" role="group" aria-label={`Cantidad de ${displayName(item)}`}>
      <button
        type="button"
        onClick={() => (item.qty <= 1 ? removeItem(item.lineId) : setQty(item.lineId, item.qty - 1))}
        aria-label={item.qty <= 1 ? `Quitar ${displayName(item)}` : 'Restar uno'}
      >
        {item.qty <= 1 ? <IconTrash /> : <IconMinus />}
      </button>
      <output className="tabular" aria-live="polite">
        {item.qty}
      </output>
      <button type="button" onClick={() => setQty(item.lineId, item.qty + 1)} disabled={item.qty >= maxQty} aria-label="Sumar uno">
        <IconPlus />
      </button>
    </div>
  )
}

function CartView({ onCheckout, onBrowse }) {
  const { items, totalItems, subtotal, removeItem } = useCart()
  const promo = activePromotions[0]

  if (items.length === 0) {
    return (
      <div className="drawer__empty">
        <Emblem size={64} />
        <p className="display">Tu selección está vacía</p>
        <p>Descubre las fragancias de la casa y guarda aquí tus favoritas.</p>
        <button type="button" className="btn" onClick={onBrowse} data-autofocus>
          Descubrir fragancias <IconArrow />
        </button>
      </div>
    )
  }

  const shippingCost = shipping.rate?.flat ?? null
  const total = subtotal + (shippingCost ?? 0)

  return (
    <>
      <ul className="drawer__items" role="list">
        {items.map((item) => (
          <li key={item.lineId} className="line">
            <Link to={`/perfumes/${item.productId}`} className="line__img" tabIndex={-1} aria-hidden="true">
              <ProductImage product={{ image: item.image, name: item.name, title: item.title, brand: item.brand }} sizes="88px" alt="" />
            </Link>
            <div className="line__info">
              <p className="line__insp">{inspiredBy(item)}</p>
              <p className="line__title">
                <Link to={`/perfumes/${item.productId}`}>{displayName(item)}</Link>
              </p>
              <p className="line__meta tabular">
                {item.sizeLabel !== DEFAULT_SIZE_LABEL ? `${item.sizeLabel} · ` : ''}
                {formatCOP(item.price)} c/u
              </p>
              <div className="line__row">
                <QtyStepper item={item} />
                <p className="line__total tabular">{formatCOP(item.price * item.qty)}</p>
              </div>
            </div>
            <button type="button" className="line__remove" onClick={() => removeItem(item.lineId)} aria-label={`Eliminar ${displayName(item)}`}>
              <IconClose />
            </button>
          </li>
        ))}
      </ul>

      <div className="drawer__summary">
        {promo && totalItems >= promo.units && (
          <p className="drawer__promo">
            <IconCheck /> Llevas {totalItems} fragancias: puedes pedir la promoción {promo.units} por {formatCOP(promo.price)} al
            confirmar tu pedido.
          </p>
        )}
        <dl className="drawer__totals">
          <div>
            <dt>Subtotal ({totalItems})</dt>
            <dd className="tabular">{formatCOP(subtotal)}</dd>
          </div>
          <div>
            <dt>Envío</dt>
            <dd>{shippingCost == null ? 'Se confirma según tu ciudad' : formatCOP(shippingCost)}</dd>
          </div>
          <div className="drawer__total">
            <dt>Total{shippingCost == null ? ' sin envío' : ''}</dt>
            <dd className="tabular">{formatCOP(total)} COP</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--block" onClick={onCheckout}>
          Continuar con el pedido <IconArrow />
        </button>
        <p className="drawer__note">Pagas por transferencia o con Addi (hasta 3 cuotas, 0% de interés). Confirmamos todo por WhatsApp.</p>
      </div>
    </>
  )
}

function CheckoutView({ customer, setCustomer, wantsPromo, setWantsPromo, onBack, onSent }) {
  const { items, totalItems, subtotal } = useCart()
  const [errors, setErrors] = useState({})
  const promo = activePromotions[0]
  const promoEligible = promo && totalItems >= promo.units

  const set = (key) => (e) => {
    setCustomer((c) => ({ ...c, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (items.length === 0) {
      onBack()
      return
    }
    const found = validate(customer)
    setErrors(found)
    const first = FIELDS.find((f) => found[f.key])
    if (first) {
      document.getElementById(`ck-${first.key}`)?.focus()
      return
    }
    const message = buildOrderMessage(items, customer, { wantsPromo: promoEligible && wantsPromo })
    const url = checkoutProviders.whatsapp.submit(message)
    onSent(url)
  }

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <button type="button" className="checkout__back" onClick={onBack}>
        <IconChevron /> Volver a tu selección
      </button>

      <fieldset className="checkout__set">
        <legend>Datos de envío</legend>
        <div className="checkout__grid">
          {FIELDS.map((f, i) => (
            <div key={f.key} className={`field ${f.wide ? 'field--wide' : ''} ${errors[f.key] ? 'has-error' : ''}`}>
              <label htmlFor={`ck-${f.key}`}>{f.label}</label>
              <input
                id={`ck-${f.key}`}
                name={f.key}
                type={f.type}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                value={customer[f.key]}
                onChange={set(f.key)}
                required={f.required}
                aria-invalid={errors[f.key] ? 'true' : undefined}
                aria-describedby={errors[f.key] ? `ck-${f.key}-err` : undefined}
                data-autofocus={i === 0 ? '' : undefined}
              />
              {errors[f.key] && (
                <p id={`ck-${f.key}-err`} className="field__err">
                  {errors[f.key]}
                </p>
              )}
            </div>
          ))}
          <div className="field field--wide">
            <label htmlFor="ck-notes">Indicaciones (opcional)</label>
            <textarea id="ck-notes" rows={2} value={customer.notes} onChange={set('notes')} placeholder="Punto de referencia, horario de entrega…" />
          </div>
        </div>
      </fieldset>

      <fieldset className="checkout__set">
        <legend>Método de pago</legend>
        <div className="pay">
          {payment.methods.map((m) => (
            <label key={m.id} className={`pay__opt ${customer.paymentMethod === m.id ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value={m.id}
                checked={customer.paymentMethod === m.id}
                onChange={() => setCustomer((c) => ({ ...c, paymentMethod: m.id }))}
              />
              <span className="pay__dot" aria-hidden="true" />
              <span className="pay__text">
                <span className="pay__label">{m.id === 'addi' ? <span className="addi__badge">Addi</span> : m.label}</span>
                <span className="pay__detail">{m.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {promoEligible && (
        <label className="checkout__promo">
          <input type="checkbox" checked={wantsPromo} onChange={(e) => setWantsPromo(e.target.checked)} />
          <span>
            Quiero aplicar la promoción {promo.units} fragancias por {formatCOP(promo.price)} COP (se confirma por WhatsApp).
          </span>
        </label>
      )}

      <div className="checkout__sum">
        <span>
          {totalItems} {totalItems === 1 ? 'fragancia' : 'fragancias'} · envío por confirmar
        </span>
        <strong className="tabular">{formatCOP(subtotal)} COP</strong>
      </div>

      <button type="submit" className="btn btn--block">
        <IconWhatsApp /> Enviar pedido por WhatsApp
      </button>
      <p className="drawer__note">
        Tu pedido todavía no queda pagado: al recibirlo te confirmamos disponibilidad, costo de envío y datos de pago por
        WhatsApp.
      </p>
    </form>
  )
}

function SentView({ url, onFinish, onKeep }) {
  return (
    <div className="sent">
      <span className="sent__icon" aria-hidden="true">
        <IconWhatsApp />
      </span>
      <p className="display sent__title">Tu pedido va camino a WhatsApp</p>
      <p>
        Envía el mensaje que se abrió en WhatsApp para que lo recibamos. Tu pedido queda <strong>pendiente de
        confirmación y pago</strong>: te responderemos con la disponibilidad, el envío y los datos para pagar.
      </p>
      <a className="btn btn--wa btn--block" href={url} target="_blank" rel="noopener noreferrer" data-autofocus>
        <IconWhatsApp /> Abrir WhatsApp de nuevo
      </a>
      <button type="button" className="btn btn--ghost btn--block" onClick={onFinish}>
        Ya lo envié · vaciar mi selección
      </button>
      <button type="button" className="sent__keep" onClick={onKeep}>
        Volver a la tienda y conservar mi selección
      </button>
    </div>
  )
}

const TITLES = { cart: 'Tu selección', checkout: 'Finalizar pedido', sent: 'Pedido enviado' }

export default function CartDrawer() {
  const { view, setView, closeCart, totalItems, clearCart, hydrated } = useCart()
  const navigate = useNavigate()
  const open = view !== 'closed'
  const ref = useDialog(open, closeCart)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [wantsPromo, setWantsPromo] = useState(true)
  const [sentUrl, setSentUrl] = useState('')
  const [shownView, setShownView] = useState('cart')

  // Mantiene el último paso visible mientras el panel se cierra (animación).
  useEffect(() => {
    if (view !== 'closed') setShownView(view)
  }, [view])

  // Al cerrar desde "enviado" se vuelve al carrito la próxima vez.
  useEffect(() => {
    if (view === 'closed' && shownView === 'sent') {
      const t = setTimeout(() => setShownView('cart'), 500)
      return () => clearTimeout(t)
    }
  }, [view, shownView])

  if (!hydrated) return null

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="drawer__scrim" onClick={closeCart} />
      <aside ref={ref} className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer__head">
          <h2 id="drawer-title" className="display">
            {TITLES[shownView]}
            {shownView === 'cart' && totalItems > 0 && <span className="drawer__count tabular">{totalItems}</span>}
          </h2>
          <ol className="drawer__steps" aria-label="Pasos del pedido">
            {['cart', 'checkout', 'sent'].map((s, i) => (
              <li key={s} className={s === shownView ? 'is-current' : ''} aria-current={s === shownView ? 'step' : undefined}>
                <span className="sr-only">{TITLES[s]}</span>
                {i + 1}
              </li>
            ))}
          </ol>
          <button type="button" className="drawer__close" onClick={closeCart} aria-label="Cerrar">
            <IconClose />
          </button>
        </header>

        <div key={shownView} className="drawer__body">
          {shownView === 'cart' && (
            <CartView
              onCheckout={() => setView('checkout')}
              onBrowse={() => {
                closeCart()
                navigate('/perfumes')
              }}
            />
          )}
          {shownView === 'checkout' && (
            <CheckoutView
              customer={customer}
              setCustomer={setCustomer}
              wantsPromo={wantsPromo}
              setWantsPromo={setWantsPromo}
              onBack={() => setView('cart')}
              onSent={(url) => {
                setSentUrl(url)
                setView('sent')
              }}
            />
          )}
          {shownView === 'sent' && (
            <SentView
              url={sentUrl}
              onFinish={() => {
                clearCart()
                setCustomer(emptyCustomer)
                closeCart()
              }}
              onKeep={closeCart}
            />
          )}
        </div>
      </aside>
    </div>
  )
}
