import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { IconSearch, IconClose } from '../components/Icons'
import { products } from '../data/products'
import { PROFILES, PROFILE_BY_KEY, GENDERS, GENDER_BY_KEY, hasProfile, normalize } from '../data/profiles'
import { getFragranceInfo } from '../data/fragranceInfo'
import useHydrated from '../hooks/useHydrated'
import useReveal from '../hooks/useReveal'
import { displayName } from '../lib/product'
import './CatalogPage.css'

const PAGE = 24
const SORTS = [
  { key: 'destacados', label: 'Orden de la casa' },
  { key: 'az', label: 'Nombre (A–Z)' },
  { key: 'marca', label: 'Casa de inspiración (A–Z)' },
  { key: 'original', label: 'Perfume original (A–Z)' },
]
const EMPTY = new URLSearchParams()

function matchesQuery(p, q) {
  if (!q) return true
  const info = getFragranceInfo(p.id)
  const hay = normalize(
    [p.name, p.title, p.brand, info?.family, ...(info?.topNotes || []), ...(info?.heartNotes || []), ...(info?.baseNotes || [])].join(' ')
  )
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t))
}

export default function CatalogPage() {
  const hydrated = useHydrated()
  const [liveParams, setParams] = useSearchParams()
  // El HTML prerenderizado muestra el catálogo sin filtros; los filtros de la
  // URL se aplican justo después de hidratar (evita diferencias de hidratación).
  const params = hydrated ? liveParams : EMPTY
  const { hash, key } = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const statusRef = useRef(null)
  const gridRef = useRef(null)
  const moreFrom = useRef(null)

  const genero = GENDER_BY_KEY[params.get('genero')] ? params.get('genero') : 'todos'
  const perfil = PROFILE_BY_KEY[params.get('perfil')] ? params.get('perfil') : null
  const orden = SORTS.some((s) => s.key === params.get('orden')) ? params.get('orden') : 'destacados'
  const q = params.get('q') || ''
  const [query, setQuery] = useState(q)
  // "Mostrar más" vive en la URL (?ver=48): sobrevive a Atrás y a la recarga,
  // y cualquier cambio de filtro vuelve a la primera página.
  const ver = parseInt(params.get('ver'), 10)
  const limit = ver > PAGE ? Math.ceil(ver / PAGE) * PAGE : PAGE

  // Solo se reemplaza el campo si la URL cambió de verdad (no por los espacios
  // de los extremos, que la búsqueda recorta mientras se escribe).
  useEffect(() => setQuery((cur) => (cur.trim() === q ? cur : q)), [q])
  // key: la lupa del encabezado vuelve a enfocar el campo aunque ya estés en #buscar.
  useEffect(() => {
    if (hydrated && hash === '#buscar') searchRef.current?.focus({ preventScroll: true })
  }, [hydrated, hash, key])

  // Tras "Mostrar más", el foco pasa a la primera tarjeta nueva.
  useEffect(() => {
    if (moreFrom.current == null) return
    gridRef.current?.children[moreFrom.current]?.querySelector('.pcard__title a')?.focus({ preventScroll: true })
    moreFrom.current = null
  }, [limit])

  // Búsqueda con pequeña espera para no reescribir la URL en cada tecla.
  useEffect(() => {
    if (!hydrated || query.trim() === q) return
    const t = setTimeout(() => update({ q: query.trim() || null }), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // Parte de la URL actual (no de la del último render): la búsqueda pendiente
  // no deshace un filtro pulsado justo después. keepScroll: la página no se mueve.
  function update(changes) {
    const next = new URLSearchParams(window.location.search)
    for (const [k, v] of Object.entries(changes)) {
      if (v == null || v === '' || v === 'todos' || (k === 'orden' && v === 'destacados')) next.delete(k)
      else next.set(k, v)
    }
    if (!('ver' in changes)) next.delete('ver')
    setParams(next, { replace: true, state: { keepScroll: true } })
  }

  function clearAll() {
    setQuery('')
    navigate('/perfumes', { replace: true, state: { keepScroll: true } })
    statusRef.current?.focus({ preventScroll: true })
  }

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) => (genero === 'todos' || p.gender === genero) && (!perfil || hasProfile(p, perfil)) && matchesQuery(p, q)
    )
    if (orden === 'az') list = [...list].sort((a, b) => displayName(a).localeCompare(displayName(b), 'es'))
    if (orden === 'original') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'es'))
    if (orden === 'marca') list = [...list].sort((a, b) => a.brand.localeCompare(b.brand, 'es') || a.title.localeCompare(b.title, 'es'))
    return list
  }, [genero, perfil, orden, q])

  const visible = filtered.slice(0, limit)
  useReveal([visible.length, genero, perfil, q, orden])

  const activeCount = (genero !== 'todos') + Boolean(perfil) + Boolean(q)
  const heading = perfil
    ? PROFILE_BY_KEY[perfil].label
    : genero !== 'todos'
      ? GENDER_BY_KEY[genero].plural
      : 'Todas las fragancias'

  return (
    <div className="cat">
      <section className="cat__hero grain" aria-labelledby="cat-title">
        <div className="wrap">
          <nav className="crumbs" aria-label="Ruta">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Fragancias</span>
          </nav>
          <p className="eyebrow">La colección Narciso Parfum</p>
          <h1 id="cat-title" className="display h-xl">
            {heading}
          </h1>
          <p className="lead">
            {perfil
              ? PROFILE_BY_KEY[perfil].lead
              : 'Eau de parfum inspirado en las fragancias más icónicas, elaborado en Ibagué. Filtra por colección o por familia olfativa.'}
          </p>
        </div>
      </section>

      <div className="cat__bar" role="search">
        <div className="wrap cat__bar-inner">
          <div className="cat__genders" role="group" aria-label="Colección">
            {[{ key: 'todos', label: 'Todas' }, ...GENDERS].map((g) => (
              <button key={g.key} type="button" aria-pressed={genero === g.key} onClick={() => update({ genero: g.key })}>
                {g.label}
              </button>
            ))}
          </div>

          <div className="cat__search" id="buscar">
            <IconSearch />
            <label htmlFor="cat-q" className="sr-only">
              Buscar por nombre, casa o nota
            </label>
            <input
              ref={searchRef}
              id="cat-q"
              type="search"
              placeholder="Nombre, casa o nota…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  searchRef.current?.focus()
                }}
                aria-label="Borrar búsqueda"
              >
                <IconClose />
              </button>
            )}
          </div>

          <label className="cat__sort">
            <span className="sr-only">Ordenar</span>
            <select value={orden} onChange={(e) => update({ orden: e.target.value })}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="wrap">
          <div className="cat__profiles" role="group" aria-label="Familia olfativa">
            <button type="button" aria-pressed={!perfil} onClick={() => update({ perfil: null })}>
              Todas las familias
            </button>
            {PROFILES.map((p) => (
              <button
                key={p.key}
                type="button"
                data-theme={p.key}
                aria-pressed={perfil === p.key}
                onClick={() => update({ perfil: perfil === p.key ? null : p.key })}
              >
                <span className="cat__dot" aria-hidden="true" />
                {p.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="wrap cat__results" aria-label="Resultados">
        <div className="cat__status">
          <p aria-live="polite" ref={statusRef} tabIndex={-1} className="route-focus">
            <strong className="tabular">{filtered.length}</strong> {filtered.length === 1 ? 'fragancia' : 'fragancias'}
          </p>
          {activeCount > 0 && (
            <button type="button" className="cat__clear" onClick={clearAll}>
              Quitar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="cat__empty">
            <p className="display">Sin coincidencias</p>
            <p>No encontramos fragancias con esos filtros. Prueba con otra palabra o quita algún filtro.</p>
            <button type="button" className="btn btn--ghost" onClick={clearAll}>
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <>
            <ul className="cat__grid" role="list" ref={gridRef}>
              {visible.map((p, i) => (
                <li key={p.id} data-reveal style={{ '--d': i % 4 }}>
                  <ProductCard product={p} headingLevel={2} />
                </li>
              ))}
            </ul>
            {visible.length < filtered.length && (
              <div className="cat__more">
                <p className="tabular">
                  Viendo {visible.length} de {filtered.length}
                </p>
                <span className="cat__progress" aria-hidden="true">
                  <span style={{ width: `${(visible.length / filtered.length) * 100}%` }} />
                </span>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    moreFrom.current = visible.length
                    update({ ver: limit + PAGE })
                  }}
                >
                  Mostrar más fragancias
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Índice completo en enlaces de texto: todas las fichas quedan enlazadas
          desde el HTML (los buscadores no pulsan "Mostrar más"). Se arma con el
          catálogo entero, igual en el prerender y en el cliente. */}
      <nav className="wrap cat__index" aria-label="Índice de fragancias">
        <details>
          <summary>Índice completo de fragancias ({products.length})</summary>
          <div className="cat__index-cols">
            {GENDERS.map((g) => (
              <section key={g.key}>
                <h2>{g.plural}</h2>
                <ul role="list">
                  {products
                    .filter((p) => p.gender === g.key)
                    .map((p) => (
                      <li key={p.id}>
                        <Link to={`/perfumes/${p.id}`}>
                          {displayName(p)} <span>· {p.title}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </nav>
    </div>
  )
}
