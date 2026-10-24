import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconArrow } from '../Icons'
import { products } from '../../data/products'
import { brand, shipping, payment } from '../../data/site'
import { activePromotions } from '../../data/promotions'
import { BOTTLE_SRC, BOTTLE_SIZES } from '../../data/heroBottle'
import './Hero.css'

function Bottle({ className, eager = false, alt = '' }) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={BOTTLE_SRC.avif} sizes={BOTTLE_SIZES} />
      <source type="image/webp" srcSet={BOTTLE_SRC.webp} sizes={BOTTLE_SIZES} />
      <img
        src="/img/hero/bottle-760.webp"
        alt={alt}
        width="280"
        height="760"
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding={eager ? 'sync' : 'async'}
      />
    </picture>
  )
}

export default function Hero() {
  const ref = useRef(null)

  // Paralaje sutil con el puntero (solo escritorio y sin movimiento reducido).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', x.toFixed(3))
        el.style.setProperty('--my', y.toFixed(3))
      })
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const promo = activePromotions[0]

  return (
    <section ref={ref} className="hero grain" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__beam" aria-hidden="true" />
      <div className="hero__smoke" aria-hidden="true" />

      <div className="hero__inner wrap">
        <div className="hero__copy">
          <p className="eyebrow hero__in" style={{ '--d': 1 }}>
            {brand.taglines.primary}
          </p>
          <h1 id="hero-title" className="display hero__title">
            <span className="hero__line">
              <span className="hero__in" style={{ '--d': 2 }}>
                Tu esencia.
              </span>
            </span>
            <span className="hero__line">
              <em className="hero__in gold-ink" style={{ '--d': 3 }}>
                Tu historia.
              </em>
            </span>
          </h1>
          <p className="hero__sub hero__in" style={{ '--d': 4 }}>
            Fragancias que expresan tu personalidad y dejan una impresión inolvidable. Eau de parfum elaborado en
            Ibagué, Tolima.
          </p>
          <div className="hero__ctas hero__in" style={{ '--d': 5 }}>
            <Link to="/perfumes" className="btn">
              Descubrir fragancias <IconArrow />
            </Link>
            {promo ? (
              <Link to="/#promociones" className="btn btn--ghost">
                Ver promociones
              </Link>
            ) : (
              <Link to="/#perfil" className="btn btn--ghost">
                Explorar por aroma
              </Link>
            )}
          </div>
        </div>

        <div className="hero__stage">
          <div className="hero__halo" aria-hidden="true" />
          <div className="hero__floor" aria-hidden="true" />
          <Bottle className="hero__bottle hero__bottle--back hero__bottle--l" />
          <Bottle className="hero__bottle hero__bottle--back hero__bottle--r" />
          <div className="hero__main">
            <div className="hero__rise">
              <Bottle
                className="hero__bottle hero__bottle--main"
                eager
                alt="Frasco negro mate de Narciso Parfum con tapa dorada y etiqueta marfil"
              />
              <span className="hero__rim" aria-hidden="true" />
              <span className="hero__sheen" aria-hidden="true" />
              <Bottle className="hero__bottle hero__reflection" />
            </div>
          </div>
          <p className="hero__caption" aria-hidden="true">
            <span>N.º 01</span> Eau de parfum · {brand.city}
          </p>
        </div>
      </div>

      <ul className="hero__facts wrap" role="list">
        <li>
          <strong className="tabular">{products.length}</strong> fragancias
        </li>
        <li>Hombre · Mujer · Unisex</li>
        <li>{shipping.coverage}</li>
        <li>
          Addi: hasta {payment.addi.installments} cuotas, {payment.addi.interest}
        </li>
      </ul>
    </section>
  )
}
