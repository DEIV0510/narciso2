import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Desplazamiento y foco entre páginas (BrowserRouter no los gestiona):
// - enlace nuevo (PUSH/REPLACE): arriba, o a la sección del #hash;
// - Atrás/Adelante y recarga: vuelve a la posición que tenía esa entrada;
// - navegaciones con state.keepScroll (filtros del catálogo): no se mueve;
// - al cambiar de página, el foco pasa al <h1> para que el lector de pantalla
//   la anuncie; al saltar a una sección, a la sección.
const STORE_KEY = 'np-scroll'
const positions = new Map()
let currentKey = null
// Cada entrada del historial se identifica por history.state.key (lo pone el
// router en cada navegación; la primera entrada recibe uno aquí) para que la
// posición sobreviva a la recarga sin confundirse con una visita nueva.
const entryKey = () => history.state?.key ?? null

function loadPositions() {
  try {
    for (const [k, y] of JSON.parse(sessionStorage.getItem(STORE_KEY) || '[]')) positions.set(k, y)
  } catch {
    // sin sessionStorage: solo se recuerda dentro de esta carga
  }
}
function savePositions() {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify([...positions].slice(-50)))
  } catch {
    // idem
  }
}

// Un fragmento mal codificado (/#50%) no puede romper la página.
function hashTarget(hash) {
  if (!hash) return null
  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // se usa tal cual
  }
  return document.getElementById(id)
}

function focusTarget(el) {
  if (!el || document.documentElement.classList.contains('is-locked')) return // menú o carrito abiertos
  if (el.contains(document.activeElement)) return // p. ej. #buscar: el catálogo ya enfocó el campo
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.classList.add('route-focus')
  el.focus({ preventScroll: true })
}

// Espera a que la página tenga altura suficiente (el catálogo filtra y crece
// justo después de montar) y vuelve a la posición guardada.
function restore(y) {
  let tries = 0
  const step = () => {
    const fits = document.documentElement.scrollHeight >= y + window.innerHeight
    if (fits || ++tries > 30) window.scrollTo({ top: y, behavior: 'instant' })
    else requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function ScrollManager() {
  const { pathname, hash, key, state } = useLocation()
  const navType = useNavigationType()
  const prevPath = useRef(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!entryKey()) history.replaceState({ ...history.state, key: Math.random().toString(36).slice(2, 10) }, '')
    loadPositions()
    // Se guarda la posición de la entrada vigente; mientras una navegación
    // está en curso (history.state ya apunta a la nueva) se ignoran los saltos
    // que provoca el cambio de contenido.
    const onScroll = () => {
      if (currentKey && entryKey() === currentKey) positions.set(currentKey, window.scrollY)
    }
    const onHide = () => document.visibilityState === 'hidden' && savePositions()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', savePositions)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', savePositions)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])

  useEffect(() => {
    const first = prevPath.current === null
    const pathChanged = !first && prevPath.current !== pathname
    prevPath.current = pathname
    currentKey = entryKey()
    const saved = positions.get(currentKey)

    // Atrás/Adelante y recarga van primero: la entrada puede conservar el
    // state.keepScroll de cuando se filtró, pero ahí manda la posición guardada.
    if (navType === 'POP' && saved != null) {
      restore(saved)
    } else if (navType !== 'POP' && state?.keepScroll) {
      positions.set(currentKey, window.scrollY)
      return
    } else {
      const el = hashTarget(hash)
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        if (!first) focusTarget(el)
        return
      }
      if (!first) window.scrollTo({ top: 0, behavior: 'instant' })
    }
    if (pathChanged) focusTarget(document.querySelector('#contenido h1') || document.getElementById('contenido'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash, key])

  return null
}
