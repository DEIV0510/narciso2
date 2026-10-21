import { IconArrow, IconInstagram, IconPin, IconTikTok, IconWhatsApp } from '../Icons'
import { brand, mapsUrl, waLink, waMessages } from '../../data/site'
import posterAvif from '../../assets/img/hero-bottle.avif'
import posterWebp from '../../assets/img/hero-bottle.webp'
import posterJpg from '../../assets/img/hero-bottle.jpg'
import './Visit.css'

export default function Visit() {
  return (
    <section id="visitanos" className="section theme-dark visit" aria-labelledby="visit-title">
      <div className="wrap visit__grid">
        <div className="visit__copy">
          <p className="eyebrow" data-reveal>
            Visítanos
          </p>
          <h2 id="visit-title" className="display h-xl" data-reveal style={{ '--d': 1 }}>
            Ibagué, <em className="gold-ink">Tolima</em>
          </h2>
          <address className="visit__address" data-reveal style={{ '--d': 2 }}>
            <IconPin />
            <span>
              {brand.address.line1}
              <br />
              {brand.address.line2}
            </span>
          </address>
          <div className="visit__ctas" data-reveal style={{ '--d': 3 }}>
            <a className="btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Cómo llegar <IconArrow />
            </a>
            <a className="btn btn--wa" href={waLink(waMessages.visit)} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp /> {brand.whatsappDisplay}
            </a>
          </div>
          <ul className="visit__social" role="list" data-reveal style={{ '--d': 4 }}>
            <li>
              <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer">
                <IconInstagram /> {brand.instagramHandle}
              </a>
            </li>
            <li>
              <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer">
                <IconTikTok /> {brand.tiktokHandle}
              </a>
            </li>
          </ul>
        </div>
        <picture className="visit__img curtain" data-reveal>
          <source type="image/avif" srcSet={posterAvif} />
          <source type="image/webp" srcSet={posterWebp} />
          <img
            src={posterJpg}
            alt="Frasco Narciso Parfum sobre el mostrador de madera, con la estantería de esencias al fondo"
            width="1086"
            height="1448"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  )
}
