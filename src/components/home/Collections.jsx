import { Link } from 'react-router-dom'
import { IconArrow } from '../Icons'
import { products } from '../../data/products'
import manAvif from '../../assets/img/gender-caballero.avif'
import manWebp from '../../assets/img/gender-caballero.webp'
import manJpg from '../../assets/img/gender-caballero.jpg'
import womanAvif from '../../assets/img/gender-dama.avif'
import womanWebp from '../../assets/img/gender-dama.webp'
import womanJpg from '../../assets/img/gender-dama.jpg'
import unisexAvif from '../../assets/img/gender-unisex.avif'
import unisexWebp from '../../assets/img/gender-unisex.webp'
import unisexJpg from '../../assets/img/gender-unisex.jpg'
import man600Avif from '../../assets/img/gender-caballero-600.avif'
import man600Webp from '../../assets/img/gender-caballero-600.webp'
import woman600Avif from '../../assets/img/gender-dama-600.avif'
import woman600Webp from '../../assets/img/gender-dama-600.webp'
import unisex600Avif from '../../assets/img/gender-unisex-600.avif'
import unisex600Webp from '../../assets/img/gender-unisex-600.webp'
import './Collections.css'

// Ancho real de .coll__frame en cada corte de Collections.css.
const COLL_SIZES = '(min-width: 1100px) 265px, (min-width: 760px) 29vw, 72vw'

// Fotos de ambiente reales que el cliente mandó para cada colección. Son
// decorativas: el enlace ya se nombra con la colección (Para él, Para ella…).
const COLLECTIONS = [
  {
    key: 'hombre',
    title: 'Para él',
    line: 'Frescos para el día, intensos para la noche.',
    img: { avif: manAvif, webp: manWebp, jpg: manJpg, avif600: man600Avif, webp600: man600Webp },
  },
  {
    key: 'mujer',
    title: 'Para ella',
    line: 'Florales, frutales y gourmand.',
    img: { avif: womanAvif, webp: womanWebp, jpg: womanJpg, avif600: woman600Avif, webp600: woman600Webp },
  },
  {
    key: 'unisex',
    title: 'Para todos',
    line: 'Ámbar, maderas y frescuras para compartir.',
    img: { avif: unisexAvif, webp: unisexWebp, jpg: unisexJpg, avif600: unisex600Avif, webp600: unisex600Webp },
  },
]

const count = (g) => products.filter((p) => p.gender === g).length

export default function Collections() {
  return (
    <section className="section theme-ivory grain coll" aria-labelledby="coll-title">
      <div className="wrap coll__grid">
        <header className="coll__head">
          <p className="eyebrow" data-reveal>
            Las colecciones
          </p>
          <h2 id="coll-title" className="display h-xl" data-reveal style={{ '--d': 1 }}>
            El lujo de <em className="gold-ink">dejar huella</em>
          </h2>
          <p className="lead" data-reveal style={{ '--d': 2 }}>
            Tres colecciones, un mismo frasco negro mate con tapa dorada. Elige desde dónde empezar tu historia.
          </p>
          <Link to="/perfumes" className="link-arrow coll__all" data-reveal style={{ '--d': 3 }}>
            Ver todo el catálogo <IconArrow />
          </Link>
        </header>

        <ul className="coll__list" role="list">
          {COLLECTIONS.map((c, i) => (
            <li key={c.key} className={`coll__item coll__item--${i}`} data-reveal style={{ '--d': i + 1 }}>
              <Link to={`/perfumes?genero=${c.key}`} className="coll__card">
                <span className="coll__frame curtain" data-reveal style={{ '--d': i + 2 }}>
                  <picture>
                    <source type="image/avif" srcSet={`${c.img.avif600} 600w, ${c.img.avif} 1000w`} sizes={COLL_SIZES} />
                    <source type="image/webp" srcSet={`${c.img.webp600} 600w, ${c.img.webp} 1000w`} sizes={COLL_SIZES} />
                    <img src={c.img.jpg} alt="" width="1000" height="1333" loading="lazy" decoding="async" />
                  </picture>
                </span>
                <span className="coll__meta">
                  <span className="coll__num tabular" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="coll__title display">{c.title}</span>
                  <span className="coll__line">{c.line}</span>
                  <span className="coll__count">
                    {count(c.key)} fragancias <IconArrow />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
