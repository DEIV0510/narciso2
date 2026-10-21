import { Link } from 'react-router-dom'
import { IconArrow, IconWhatsApp, IconCard } from '../Icons'
import { activePromotions } from '../../data/promotions'
import { payment, waLink, waMessages } from '../../data/site'
import { formatCOP } from '../../lib/format'
import './Promotions.css'

const BOTTLE = {
  avif: '/img/hero/bottle-760.avif',
  webp: '/img/hero/bottle-760.webp',
}

function Bottle({ className }) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={BOTTLE.avif} />
      <img src={BOTTLE.webp} alt="" width="280" height="760" loading="lazy" decoding="async" />
    </picture>
  )
}

function formatDate(iso) {
  return new Date(`${iso}T12:00:00-05:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

function PromoFeature({ promo }) {
  const regular = promo.unitPrice * promo.units
  return (
    <article className="promo" aria-labelledby={`promo-${promo.id}`}>
      <div className="promo__scene" aria-hidden="true">
        <span className="promo__spot" />
        <span className="promo__stone" />
        <Bottle className="promo__bottle promo__bottle--l" />
        <Bottle className="promo__bottle promo__bottle--r" />
        <Bottle className="promo__bottle promo__bottle--c" />
      </div>

      <div className="promo__copy">
        <p className="eyebrow" data-reveal>
          {promo.eyebrow}
        </p>
        <h3 id={`promo-${promo.id}`} className="promo__title display" data-reveal style={{ '--d': 1 }}>
          {promo.title}
          <span className="promo__price">
            <span className="promo__units">{promo.units} por</span>
            <span className="tabular">{formatCOP(promo.price)}</span>
            <small>COP</small>
          </span>
        </h3>

        <dl className="promo__facts" data-reveal style={{ '--d': 2 }}>
          <div>
            <dt>Incluye</dt>
            <dd>{promo.includes}</dd>
          </div>
          <div>
            <dt>Precio de la promoción</dt>
            <dd className="tabular">
              {formatCOP(promo.price)} COP por {promo.units} fragancias
            </dd>
          </div>
          <div>
            <dt>Precio individual</dt>
            <dd className="tabular">
              {formatCOP(promo.unitPrice)} COP cada una (50 ml) · {promo.units} por separado: {formatCOP(regular)} COP
            </dd>
          </div>
          <div>
            <dt>Condiciones</dt>
            <dd>
              <ul role="list" className="promo__conditions">
                {promo.conditions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </dd>
          </div>
          {promo.validUntil && (
            <div>
              <dt>Vigencia</dt>
              <dd>Hasta el {formatDate(promo.validUntil)}</dd>
            </div>
          )}
        </dl>

        <div className="promo__ctas" data-reveal style={{ '--d': 3 }}>
          <Link to="/perfumes" className="btn">
            Armar mi combo <IconArrow />
          </Link>
          <a className="btn btn--wa" href={waLink(promo.whatsappMessage)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp /> Pedir por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Promotions() {
  const promo = activePromotions[0]
  return (
    <section id="promociones" className="section theme-dark grain promos" aria-labelledby="promos-title">
      <div className="wrap">
        <header className="promos__head">
          <h2 id="promos-title" className="display h-lg" data-reveal>
            Promociones <em className="gold-ink">de la casa</em>
          </h2>
        </header>

        {promo ? (
          <PromoFeature promo={promo} />
        ) : (
          // Sin promociones activas: espacio preparado, sin ofertas ficticias.
          <div className="promos__empty">
            <p className="lead">
              En este momento no tenemos promociones activas. Escríbenos y te contamos cuando llegue la próxima edición.
            </p>
            <a className="btn btn--wa" href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp /> Avísenme por WhatsApp
            </a>
          </div>
        )}

        <aside className="addi" aria-label="Pago con Addi" data-reveal>
          <span className="addi__icon" aria-hidden="true">
            <IconCard />
          </span>
          <p className="addi__text">
            <span className="addi__badge">Addi</span> Paga tu pedido en hasta {payment.addi.installments} cuotas,{' '}
            {payment.addi.interest}.
          </p>
          <a className="link-arrow" href={waLink(waMessages.addi())} target="_blank" rel="noopener noreferrer">
            Comprar con Addi <IconArrow />
          </a>
        </aside>
      </div>
    </section>
  )
}
