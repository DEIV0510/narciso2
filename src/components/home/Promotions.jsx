import { Link } from 'react-router-dom'
import { IconArrow, IconWhatsApp, IconCard } from '../Icons'
import { activePromotions } from '../../data/promotions'
import { SIZES, SHOW_PRICES } from '../../data/products'
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
              {formatCOP(promo.unitPrice)} COP cada una{promo.sizeLabel ? ` (${promo.sizeLabel})` : ''} · {promo.units} por separado:{' '}
              {formatCOP(regular)} COP
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

// Sin promociones activas la portada no muestra ofertas: en su lugar presenta
// las dos presentaciones reales del frasco (dato comercial verificado).
function Sizes() {
  return (
    <article className="sizes" aria-labelledby="sizes-title">
      <div className="promo__scene sizes__scene" aria-hidden="true">
        <span className="promo__spot" />
        <span className="promo__stone" />
        <Bottle className="promo__bottle sizes__bottle--small" />
        <Bottle className="promo__bottle sizes__bottle--big" />
      </div>
      <div className="promo__copy">
        <p className="eyebrow" data-reveal>
          El frasco de la casa
        </p>
        <h2 id="sizes-title" className="display h-lg" data-reveal style={{ '--d': 1 }}>
          Dos presentaciones, <em className="gold-ink">una misma esencia</em>
        </h2>
        <p className="lead" data-reveal style={{ '--d': 2 }}>
          Todas las fragancias del catálogo, en Eau de parfum, con el frasco negro mate y la tapa dorada de Narciso.
        </p>
        <ul className="sizes__list" role="list" data-reveal style={{ '--d': 3 }}>
          {SIZES.map((s) => (
            <li key={s.label}>
              <span className="sizes__ml display">{s.label}</span>
              {SHOW_PRICES && (
                <span className="sizes__price tabular">
                  {formatCOP(s.price)} <small>COP</small>
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="promo__ctas" data-reveal style={{ '--d': 4 }}>
          <Link to="/perfumes" className="btn">
            Elegir mi fragancia <IconArrow />
          </Link>
          <a className="btn btn--wa" href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp /> Asesoría por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Promotions() {
  const promo = activePromotions[0]
  return (
    <section
      id={promo ? 'promociones' : 'presentaciones'}
      className="section theme-dark grain promos"
      aria-labelledby={promo ? 'promos-title' : 'sizes-title'}
    >
      <div className="wrap">
        {promo ? (
          <>
            <header className="promos__head">
              <h2 id="promos-title" className="display h-lg" data-reveal>
                Promociones <em className="gold-ink">de la casa</em>
              </h2>
            </header>
            <PromoFeature promo={promo} />
          </>
        ) : (
          <Sizes />
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
