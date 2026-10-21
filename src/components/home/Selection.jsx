import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard'
import { IconArrow } from '../Icons'
import { getProductById, products } from '../../data/products'
import { FEATURED_IDS } from '../../data/featured'
import './Selection.css'

const featured = FEATURED_IDS.map(getProductById).filter(Boolean)

export default function Selection() {
  return (
    <section className="section theme-carbon sel" aria-labelledby="sel-title">
      <div className="sel__light" aria-hidden="true" />
      <div className="wrap">
        <header className="sel__head">
          <div>
            <p className="eyebrow" data-reveal>
              La selección de la casa
            </p>
            <h2 id="sel-title" className="display h-xl" data-reveal style={{ '--d': 1 }}>
              Fragancias con <em className="gold-ink">carácter</em>
            </h2>
          </div>
          <div className="sel__aside" data-reveal style={{ '--d': 2 }}>
            <p className="lead">
              Ocho referencias para empezar: cada tarjeta toma la luz de su familia olfativa, de los cítricos fríos a los
              ámbares nocturnos.
            </p>
            <Link to="/perfumes" className="link-arrow">
              Ver las {products.length} fragancias <IconArrow />
            </Link>
          </div>
        </header>

        <ul className="sel__grid" role="list">
          {featured.map((p, i) => (
            <li key={p.id} data-reveal style={{ '--d': (i % 4) + 1 }}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
