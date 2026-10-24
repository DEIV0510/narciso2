import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

// Respaldo por si el hosting no redirige /index.html o /ruta.html a la URL
// limpia: el router debe recibir la misma ruta que se prerenderizó.
const clean = location.pathname.replace(/\/index\.html$/, '/').replace(/(.)\.html$/, '$1')
if (clean !== location.pathname && location.pathname !== '/404.html') {
  history.replaceState(history.state, '', clean + location.search + location.hash)
}

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
)

// En producción cada ruta llega prerenderizada (scripts/prerender.mjs) y se
// hidrata; en desarrollo el contenedor llega vacío.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
// La pantalla de carga (index.html) comprueba esta marca: si la app no llegó a
// arrancar, quita la clase .js y el contenido prerenderizado se ve sin animar.
window.__npApp = true
