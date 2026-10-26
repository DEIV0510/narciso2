import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductImage from '../ProductImage'
import { IconArrow } from '../Icons'
import { PROFILES, PROFILE_BY_KEY, productsByProfile, profileCounts, GENDERS } from '../../data/profiles'
import { formatCOP } from '../../lib/format'
import { SHOW_PRICES } from '../../data/products'
import { displayName, inspiredBy } from '../../lib/product'
import './ProfileExplorer.css'

// Alterna géneros (hombre, mujer, unisex, hombre…) para que la muestra de
// "Todos" no sean cuatro perfumes de la misma sección del catálogo.
function interleave(list) {
  const groups = GENDERS.map((g) => list.filter((p) => p.gender === g.key))
  const out = []
  for (let i = 0; out.length < list.length; i++) {
    for (const g of groups) if (g[i]) out.push(g[i])
  }
  return out
}

export default function ProfileExplorer() {
  const [active, setActive] = useState(PROFILES[0].key)
  const [gender, setGender] = useState('todos')
  const tabsRef = useRef([])
  const profile = PROFILE_BY_KEY[active]

  const list = useMemo(() => {
    const all = productsByProfile(active)
    return gender === 'todos' ? interleave(all) : all.filter((p) => p.gender === gender)
  }, [active, gender])
  const picks = list.slice(0, 4)

  const query = new URLSearchParams({ perfil: active, ...(gender !== 'todos' ? { genero: gender } : {}) })

  const onKeyDown = (e, index) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    let next = null
    if (e.key in keys) next = (index + keys[e.key] + PROFILES.length) % PROFILES.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = PROFILES.length - 1
    if (next === null) return
    e.preventDefault()
    setActive(PROFILES[next].key)
    tabsRef.current[next]?.focus()
  }

  return (
    <section id="perfil" className="section theme-ivory grain pex" aria-labelledby="pex-title">
      <div className="wrap">
        <header className="pex__head">
          <p className="eyebrow" data-reveal>
            Descubre tu perfil olfativo
          </p>
          <h2 id="pex-title" className="display h-xl" data-reveal style={{ '--d': 1 }}>
            ¿A qué quieres <em className="gold-ink">oler</em> hoy?
          </h2>
          <p className="lead" data-reveal style={{ '--d': 2 }}>
            Elige una familia y te mostramos las fragancias del catálogo que pertenecen a ella, según su pirámide olfativa
            verificada.
          </p>
        </header>

        <div className="pex__layout">
          <div className="pex__tabs" role="tablist" aria-label="Familias olfativas" aria-orientation="vertical">
            {PROFILES.map((p, i) => (
              <button
                key={p.key}
                ref={(el) => (tabsRef.current[i] = el)}
                type="button"
                role="tab"
                id={`pex-tab-${p.key}`}
                aria-selected={active === p.key}
                aria-controls="pex-panel"
                tabIndex={active === p.key ? 0 : -1}
                className="pex__tab"
                data-theme={p.key}
                onClick={() => setActive(p.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className="pex__dot" aria-hidden="true" />
                <span className="pex__tab-label">{p.label}</span>
                <span className="pex__tab-count tabular">{profileCounts[p.key]}</span>
              </button>
            ))}
          </div>

          <div
            id="pex-panel"
            role="tabpanel"
            aria-labelledby={`pex-tab-${active}`}
            className="pex__panel"
            data-theme={active}
          >
            <div key={active} className="pex__visual tex" data-theme={active}>
              <span className="pex__visual-count tabular">{profileCounts[active]} fragancias</span>
              <p className="pex__visual-title display">{profile.label}</p>
              <p className="pex__visual-lead">{profile.lead}</p>
            </div>

            <div className="pex__genders" role="group" aria-label="Filtrar por género">
              {[{ key: 'todos', label: 'Todos' }, ...GENDERS].map((g) => (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={gender === g.key}
                  className="pex__gender"
                  onClick={() => setGender(g.key)}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {picks.length > 0 ? (
              <ul key={`${active}-${gender}`} className="pex__picks" role="list">
                {picks.map((p, i) => (
                  <li key={p.id} style={{ '--i': i }}>
                    <Link to={`/perfumes/${p.id}`} className="pex__pick">
                      <span className="pex__pick-img">
                        <ProductImage product={p} sizes="(min-width: 1000px) 160px, 40vw" alt="" />
                      </span>
                      <span className="pex__pick-insp">{inspiredBy(p)}</span>
                      <span className="pex__pick-title">{displayName(p)}</span>
                      {SHOW_PRICES && <span className="pex__pick-price tabular">Desde {formatCOP(p.price)}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pex__empty">No hay fragancias de esta familia para el género elegido. Prueba con “Todos”.</p>
            )}

            {list.length > 0 && (
              <Link to={`/perfumes?${query}`} className="btn btn--dark pex__cta">
                Ver {list.length === 1 ? 'la fragancia' : `las ${list.length} fragancias`} <IconArrow />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
