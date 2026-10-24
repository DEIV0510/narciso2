import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import NotFoundPage from './NotFoundPage'
import { IconArrow, IconBag, IconCard, IconMinus, IconPlus, IconTruck, IconWhatsApp, IconSun, IconMoon, IconSpark, IconPin } from '../components/Icons'
import { getProductById, products } from '../data/products'
import { getFragranceInfo } from '../data/fragranceInfo'
import { productTheme, productProfiles, PROFILE_BY_KEY, GENDER_BY_KEY } from '../data/profiles'
import { brand, payment, shipping, waLink, waMessages } from '../data/site'
import { useCart } from '../context/CartContext'
import useReveal from '../hooks/useReveal'
import { formatCOP } from '../lib/format'
import { displayName, inspiredBy, longName, reference } from '../lib/product'
import labelAvif from '../assets/img/label-detail.avif'
import labelWebp from '../assets/img/label-detail.webp'
import labelJpg from '../assets/img/label-detail.jpg'
import ambientAvif from '../assets/img/hero-bottle.avif'
import ambientWebp from '../assets/img/hero-bottle.webp'
import ambientJpg from '../assets/img/hero-bottle.jpg'
import './ProductPage.css'

const MAX_QTY = 20

// Recomendaciones: mismo género primero, luego familias olfativas en común y
// misma casa de inspiración. Siempre productos reales del catálogo.
function related(product, limit = 4) {
  const mine = new Set(productProfiles(product))
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      const shared = productProfiles(p).filter((k) => mine.has(k)).length
      const s = (p.gender === product.gender ? 4 : 0) + shared * 2 + (p.brand === product.brand ? 1 : 0)
      return { p, s }
    })
    .filter(({ s }) => s > 4)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p)
}

const joinEs = (list) =>
  list.length <= 1 ? list.join('') : `${list.slice(0, -1).join(', ')} y ${list[list.length - 1]}`

// "Para quién": frase construida solo con ocasión, momento y estación verificados.
function audienceLine(info) {
  const t = info.timeOfDay || []
  const when =
    t.includes('Día') && t.includes('Noche') ? 'para el día y la noche' : t.includes('Noche') ? 'de noche' : 'de día'
  const occ = (info.occasions || []).map((o) => o.toLowerCase())
  const seasons = (info.season || []).map((s) => s.toLowerCase())
  return `Para quien busca una fragancia ${when}${occ.length ? `, pensada para ${joinEs(occ)}` : ''}${
    seasons.length === 4 ? ', en cualquier época del año' : seasons.length ? `, en ${joinEs(seasons)}` : ''
  }.`
}

function Gallery({ product }) {
  const [active, setActive] = useState(0)
  const views = [
    { key: 'own', label: 'Fragancia' },
    { key: 'label', label: 'Etiqueta' },
    { key: 'ambient', label: 'Frasco' },
  ]
  return (
    <div className="pdp__gallery">
      <div className="pdp__stage">
        <span className="pdp__halo" aria-hidden="true" />
        <div className="pdp__arch" key={active}>
          {active === 0 && <ProductImage product={product} sizes="(min-width: 1000px) 520px, 88vw" eager />}
          {active === 1 && (
            <picture>
              <source type="image/avif" srcSet={labelAvif} />
              <source type="image/webp" srcSet={labelWebp} />
              <img src={labelJpg} alt="Etiqueta del frasco Narciso Parfum: Eau de parfum, especialistas en inspiración" width="599" height="599" />
            </picture>
          )}
          {active === 2 && (
            <picture>
              <source type="image/avif" srcSet={ambientAvif} />
              <source type="image/webp" srcSet={ambientWebp} />
              <img src={ambientJpg} alt="Frasco Narciso Parfum sobre un mostrador de madera, con estantería de esencias al fondo" width="1086" height="1448" />
            </picture>
          )}
        </div>
      </div>
      <div className="pdp__thumbs" role="group" aria-label="Fotos del producto">
        {views.map((v, i) => (
          <button key={v.key} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Purchase({ product }) {
  const { addItem, openCart } = useCart()
  const sizes = product.sizes || []
  const [sizeLabel, setSizeLabel] = useState(sizes[0]?.label)
  const [qty, setQty] = useState(1)
  const unit = sizes.find((s) => s.label === sizeLabel)?.price ?? product.price
  const total = unit * qty
  const waMessage = `Hola, ${brand.name}. Quiero comprar ${qty} × ${longName(product)}${
    sizeLabel ? `, ${sizeLabel}` : ''
  } por ${formatCOP(total)} COP. ¿Me confirman disponibilidad?`

  const add = () => {
    addItem(product, { sizeLabel, qty, silent: true })
    openCart()
  }

  return (
    <div className="buy">
      <p className="buy__price">
        <span className="tabular">{formatCOP(unit)}</span> <small>COP</small>
      </p>
      <p className="buy__format">
        {brand.productFormat}
        {sizeLabel ? ` · ${sizeLabel}` : ''} · Frasco Narciso Parfum
      </p>

      {sizes.length > 0 && (
        <fieldset className="buy__field">
          <legend>Presentación</legend>
          <div className="buy__sizes">
            {sizes.map((s) => (
              <label key={s.label} className={sizeLabel === s.label ? 'is-on' : ''}>
                <input type="radio" name="size" value={s.label} checked={sizeLabel === s.label} onChange={() => setSizeLabel(s.label)} />
                <span>{s.label}</span>
                <span className="tabular">{formatCOP(s.price)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="buy__field">
        <span className="buy__legend" id="qty-label">
          Cantidad
        </span>
        <div className="buy__row">
          <div className="qty qty--lg" role="group" aria-labelledby="qty-label">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Restar uno">
              <IconMinus />
            </button>
            <output className="tabular" aria-live="polite">
              {qty}
            </output>
            <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Sumar uno">
              <IconPlus />
            </button>
          </div>
          {qty > 1 && <p className="buy__subtotal tabular">Total: {formatCOP(total)} COP</p>}
        </div>
      </div>

      <div className="buy__ctas">
        <button type="button" className="btn btn--block" onClick={add}>
          <IconBag /> Añadir a mi selección
        </button>
        <a className="btn btn--wa btn--block" href={waLink(waMessage)} target="_blank" rel="noopener noreferrer">
          <IconWhatsApp /> Comprar por WhatsApp
        </a>
      </div>

      <ul className="buy__facts" role="list">
        <li>
          <IconTruck /> <span>{shipping.coverage}. {shipping.pendingNote}</span>
        </li>
        <li>
          <IconCard />
          <span>
            Transferencia o{' '}
            <a href={waLink(waMessages.addi(longName(product)))} target="_blank" rel="noopener noreferrer">
              <span className="addi__badge">Addi</span> hasta {payment.addi.installments} cuotas, {payment.addi.interest}
            </a>
            .
          </span>
        </li>
        <li>
          <IconPin /> <span>Elaborado en {brand.city}. Disponibilidad confirmada al recibir tu pedido.</span>
        </li>
      </ul>

      {/* Barra fija de compra en móvil: precio y botón siempre a mano. */}
      <div className="buy__sticky">
        <div>
          <p className="buy__sticky-title">{displayName(product)}</p>
          <p className="tabular">{formatCOP(total)} COP</p>
        </div>
        <button type="button" className="btn btn--sm" onClick={add}>
          <IconBag /> Añadir
        </button>
      </div>
    </div>
  )
}

function Pyramid({ info }) {
  const tiers = [
    { key: 'top', label: 'Notas de salida', hint: 'Lo primero que percibes', notes: info.topNotes },
    { key: 'heart', label: 'Notas de corazón', hint: 'El carácter, tras unos minutos', notes: info.heartNotes },
    { key: 'base', label: 'Notas de fondo', hint: 'La estela que permanece', notes: info.baseNotes },
  ]
  return (
    <ol className="pyr" role="list">
      {tiers.map((t, i) => (
        <li key={t.key} className={`pyr__tier pyr__tier--${t.key}`} data-reveal style={{ '--d': i + 1 }}>
          <div className="pyr__label">
            <span className="pyr__n tabular">0{i + 1}</span>
            <span>
              <strong>{t.label}</strong>
              <small>{t.hint}</small>
            </span>
          </div>
          <ul className="pyr__notes" role="list">
            {t.notes.map((n) => (
              <li key={n} className="chip">
                {n}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProductById(slug)
  const info = product ? getFragranceInfo(product.id) : null
  const recs = useMemo(() => (product ? related(product) : []), [product])
  useReveal([slug])

  if (!product) return <NotFoundPage />

  const theme = productTheme(product)
  const profiles = productProfiles(product).map((k) => PROFILE_BY_KEY[k])
  const gender = GENDER_BY_KEY[product.gender]
  const familyTokens = info ? info.family.split(/\s+/).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()) : []
  const referenceText = info?.year ? `${reference(product)} (${info.year})` : reference(product)
  const name = displayName(product)

  return (
    <article className="pdp" data-theme={theme} key={product.id}>
      <section className="pdp__main grain">
        <div className="wrap pdp__grid">
          <Gallery product={product} />

          <div className="pdp__info">
            <nav className="crumbs" aria-label="Ruta">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/perfumes?genero=${product.gender}`}>{gender?.plural}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{name}</span>
            </nav>
            <p className="eyebrow pdp__insp">{inspiredBy(product)}</p>
            <h1 className="display pdp__title">{name}</h1>
            <p className="pdp__meta">
              {info ? <span className="pdp__family">{info.family}</span> : null}
              <span>{product.category.replace('Perfumería ', 'Colección ')}</span>
            </p>
            {info && <p className="pdp__profile">{info.profile}</p>}
            <Purchase product={product} />
          </div>
        </div>
      </section>

      {info ? (
        <>
          <section className="section theme-ivory grain pdp__olf" aria-labelledby="olf-title">
            <div className="wrap pdp__olf-grid">
              <header className="pdp__olf-head">
                <p className="eyebrow" data-reveal>
                  Bloque olfativo
                </p>
                <h2 id="olf-title" className="display h-lg" data-reveal style={{ '--d': 1 }}>
                  La pirámide de <em className="gold-ink">{name}</em>
                </h2>
                <dl className="pdp__facts" data-reveal style={{ '--d': 2 }}>
                  <div>
                    <dt>Familia olfativa</dt>
                    <dd>{info.family}</dd>
                  </div>
                  <div>
                    <dt>Acordes de familia</dt>
                    <dd>{familyTokens.join(' · ')}</dd>
                  </div>
                  {profiles.length > 0 && (
                    <div>
                      <dt>Perfiles</dt>
                      <dd className="pdp__profiles">
                        {profiles.map((p) => (
                          <Link key={p.key} to={`/perfumes?perfil=${p.key}`} data-theme={p.key}>
                            {p.short}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>Referencia olfativa</dt>
                    <dd>{referenceText}</dd>
                  </div>
                </dl>
              </header>
              <Pyramid info={info} />
            </div>
          </section>

          <section className="pdp__exp tex" data-theme={theme} aria-labelledby="exp-title">
            <div className="pdp__exp-photo" aria-hidden="true">
              <ProductImage product={product} sizes="60vw" alt="" />
            </div>
            <div className="wrap pdp__exp-grid">
              <div className="pdp__exp-copy">
                <p className="eyebrow" data-reveal>
                  La experiencia
                </p>
                <h2 id="exp-title" className="display h-lg" data-reveal style={{ '--d': 1 }}>
                  Cómo se <em>siente</em>
                </h2>
                <blockquote className="pdp__quote display" data-reveal style={{ '--d': 2 }}>
                  {info.profile}
                </blockquote>
              </div>
              <ul className="pdp__exp-list" role="list">
                <li data-reveal style={{ '--d': 1 }}>
                  <IconSpark />
                  <span>
                    <strong>Ocasiones</strong>
                    {joinEs(info.occasions)}
                  </span>
                </li>
                <li data-reveal style={{ '--d': 2 }}>
                  {info.timeOfDay?.includes('Noche') && !info.timeOfDay?.includes('Día') ? <IconMoon /> : <IconSun />}
                  <span>
                    <strong>Momento del día</strong>
                    {joinEs(info.timeOfDay)}
                  </span>
                </li>
                <li data-reveal style={{ '--d': 3 }}>
                  <IconSun />
                  <span>
                    <strong>Estación o clima</strong>
                    {info.season.length === 4 ? 'Todo el año' : joinEs(info.season)}
                  </span>
                </li>
                <li data-reveal style={{ '--d': 4 }}>
                  <IconArrow />
                  <span>
                    <strong>Para quién</strong>
                    {audienceLine(info)}
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </>
      ) : (
        <section className="section theme-ivory pdp__pending">
          <div className="wrap">
            <p className="eyebrow">Bloque olfativo</p>
            <h2 className="display h-md">Ficha olfativa en verificación</h2>
            <p className="lead">
              Aún no publicamos la pirámide de esta fragancia porque no encontramos una fuente fiable de sus notas. Escríbenos
              y te contamos cómo huele.
            </p>
            <a className="btn btn--line-dark" href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp /> Preguntar por WhatsApp
            </a>
          </div>
        </section>
      )}

      {recs.length > 0 && (
        <section className="section theme-carbon pdp__recs" aria-labelledby="recs-title">
          <div className="wrap">
            <header className="pdp__recs-head">
              <h2 id="recs-title" className="display h-lg" data-reveal>
                También podría <em className="gold-ink">gustarte</em>
              </h2>
              <Link to={`/perfumes?genero=${product.gender}`} className="link-arrow" data-reveal>
                Ver {gender?.plural.toLowerCase()} <IconArrow />
              </Link>
            </header>
            <ul className="pdp__recs-grid" role="list">
              {recs.map((p, i) => (
                <li key={p.id} data-reveal style={{ '--d': i + 1 }}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  )
}
