import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { IconBag, IconCheck } from './Icons'
import { useCart } from '../context/CartContext'
import { getFragranceInfo } from '../data/fragranceInfo'
import { SHOW_PRICES } from '../data/products'
import { productTheme } from '../data/profiles'
import { brand } from '../data/site'
import { formatCOP } from '../lib/format'
import { displayName, inspiredBy } from '../lib/product'
import './ProductCard.css'

const CARD_SIZES = '(min-width: 1200px) 300px, (min-width: 760px) 30vw, 46vw'

// Tres notas representativas: la primera de cada nivel y, si algún nivel viene
// vacío (pirámides sin niveles), se completa con las siguientes.
function keyNotes(info) {
  const tiers = [info.topNotes || [], info.heartNotes || [], info.baseNotes || []]
  const picked = [...new Set(tiers.map((t) => t[0]).filter(Boolean))]
  for (const n of tiers.flatMap((t) => t.slice(1))) {
    if (picked.length >= 3) break
    if (!picked.includes(n)) picked.push(n)
  }
  return picked.slice(0, 3)
}

export default function ProductCard({ product, eager = false, headingLevel = 3 }) {
  const { addItem } = useCart()
  const sizes = product.sizes || []
  const [sizeLabel, setSizeLabel] = useState(sizes[0]?.label)
  const [added, setAdded] = useState(false)
  const info = getFragranceInfo(product.id)
  const price = sizes.find((s) => s.label === sizeLabel)?.price ?? product.price
  const notes = info ? keyNotes(info) : []
  const href = `/perfumes/${product.id}`
  const Heading = `h${headingLevel}`
  const name = displayName(product)

  const onAdd = () => {
    addItem(product, { sizeLabel })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="pcard" data-theme={productTheme(product)}>
      <Link to={href} className="pcard__media" tabIndex={-1} aria-hidden="true">
        <span className="pcard__glow" />
        <span className="pcard__arch">
          <ProductImage product={product} sizes={CARD_SIZES} eager={eager} alt="" />
        </span>
        <span className="pcard__tags">
          {info && (
            <span className="pcard__family">
              <span>{info.family}</span>
            </span>
          )}
          {product.code && <span className="pcard__code tabular">{product.code}</span>}
        </span>
        <span className="pcard__view">Ver ficha</span>
      </Link>

      <div className="pcard__body">
        <p className="pcard__insp">{inspiredBy(product)}</p>
        <Heading className="pcard__title">
          <Link to={href}>{name}</Link>
        </Heading>
        <p className="pcard__format">{brand.productFormat}</p>
        {/* La familia y el código visibles viven en el enlace decorativo (aria-hidden). */}
        {info && <p className="sr-only">Familia olfativa: {info.family}</p>}
        {product.code && <p className="sr-only">Código {product.code}</p>}
        {notes.length > 0 && (
          <p className="pcard__notes">
            <span className="sr-only">Notas principales: </span>
            {notes.join(' · ')}
          </p>
        )}

        {sizes.length > 1 && (
          <div className="pcard__sizes" role="group" aria-label={`Presentación de ${name}`}>
            {sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                aria-pressed={sizeLabel === s.label}
                onClick={() => setSizeLabel(s.label)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className={`pcard__foot${SHOW_PRICES ? '' : ' pcard__foot--solo'}`}>
          {SHOW_PRICES && (
            <p className="pcard__price tabular">
              {formatCOP(price)} <span>COP</span>
            </p>
          )}
          <button
            type="button"
            className={`pcard__add ${added ? 'is-added' : ''}`}
            onClick={onAdd}
            aria-label={`Añadir ${name}${sizeLabel ? `, ${sizeLabel}` : ''}, a tu selección`}
          >
            {added ? <IconCheck /> : <IconBag />}
            <span>{added ? 'Añadido' : 'Añadir'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
