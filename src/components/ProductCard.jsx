import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import { IconBag, IconCheck } from './Icons'
import { useCart } from '../context/CartContext'
import { getFragranceInfo } from '../data/fragranceInfo'
import { productTheme } from '../data/profiles'
import { brand } from '../data/site'
import { formatCOP } from '../lib/format'
import './ProductCard.css'

const CARD_SIZES = '(min-width: 1200px) 300px, (min-width: 760px) 30vw, 46vw'

export default function ProductCard({ product, eager = false, headingLevel = 3 }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const info = getFragranceInfo(product.id)
  const size = product.sizes?.[0]
  const price = size?.price ?? product.price
  const notes = info ? [info.topNotes[0], info.heartNotes[0], info.baseNotes[0]].filter(Boolean) : []
  const href = `/perfumes/${product.id}`
  const Heading = `h${headingLevel}`

  const onAdd = () => {
    addItem(product)
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
        {info && <span className="pcard__family">{info.family}</span>}
        <span className="pcard__view">Ver ficha</span>
      </Link>

      <div className="pcard__body">
        <p className="pcard__insp">Inspirado en {product.brand}</p>
        <Heading className="pcard__title">
          <Link to={href}>{product.title}</Link>
        </Heading>
        <p className="pcard__format">
          {brand.productFormat}
          {size ? ` · ${size.label}` : ''}
        </p>
        {notes.length > 0 && (
          <p className="pcard__notes">
            <span className="sr-only">Notas principales: </span>
            {notes.join(' · ')}
          </p>
        )}
        <div className="pcard__foot">
          <p className="pcard__price tabular">
            {formatCOP(price)} <span>COP</span>
          </p>
          <button
            type="button"
            className={`pcard__add ${added ? 'is-added' : ''}`}
            onClick={onAdd}
            aria-label={`Añadir ${product.title} a tu selección`}
          >
            {added ? <IconCheck /> : <IconBag />}
            <span>{added ? 'Añadido' : 'Añadir'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
