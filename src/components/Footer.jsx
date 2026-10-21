import { Link } from 'react-router-dom'
import Logo from './Logo'
import { IconInstagram, IconTikTok, IconWhatsApp } from './Icons'
import { brand, mapsUrl, payment, shipping, waLink, waMessages } from '../data/site'
import { GENDERS, PROFILES } from '../data/profiles'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr__top wrap">
        <div className="ftr__brand">
          <Logo tone="dark" height={110} />
          <p className="ftr__tag display">
            {brand.taglines.story.split(', ')[0]}, <em className="gold-ink">{brand.taglines.story.split(', ')[1]}</em>
          </p>
        </div>

        <nav className="ftr__cols" aria-label="Pie de página">
          <div>
            <p className="ftr__h">Colecciones</p>
            <ul role="list">
              {GENDERS.map((g) => (
                <li key={g.key}>
                  <Link to={`/perfumes?genero=${g.key}`}>{g.plural}</Link>
                </li>
              ))}
              <li>
                <Link to="/perfumes">Todo el catálogo</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="ftr__h">Perfiles</p>
            <ul role="list">
              {PROFILES.slice(0, 7).map((p) => (
                <li key={p.key}>
                  <Link to={`/perfumes?perfil=${p.key}`}>{p.short}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="ftr__h">Contacto</p>
            <ul role="list">
              <li>
                <a href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer">
                  WhatsApp {brand.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  {brand.address.line1}, {brand.city}
                </a>
              </li>
              <li>{shipping.coverage}</li>
              <li>Pagos: {payment.methods.map((m) => m.label).join(' · ')}</li>
            </ul>
            <div className="ftr__social">
              <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${brand.instagramHandle}`}>
                <IconInstagram />
              </a>
              <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label={`TikTok ${brand.tiktokHandle}`}>
                <IconTikTok />
              </a>
              <a href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <IconWhatsApp />
              </a>
            </div>
          </div>
        </nav>
      </div>

      <div className="ftr__legal wrap">
        <p>
          Narciso Parfum elabora fragancias de inspiración. Los nombres y marcas de perfumes citados pertenecen a sus
          respectivos titulares y se mencionan solo como referencia olfativa; Narciso Parfum no vende ni está asociado
          a esas marcas.
        </p>
        <p>
          © {__BUILD_YEAR__} {brand.name} · {brand.legalLine} · {brand.city}
        </p>
      </div>
    </footer>
  )
}
