import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// En producción cada ruta llega prerenderizada (scripts/prerender.mjs) y se
// hidrata; en desarrollo el contenedor llega vacío.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
