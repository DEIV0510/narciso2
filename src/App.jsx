import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './styles/base.css'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import WhatsAppFloat from './components/WhatsAppFloat'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import NotFoundPage from './pages/NotFoundPage'
import useDocumentMeta from './hooks/useDocumentMeta'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  useDocumentMeta(pathname)

  return (
    <CartProvider>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <ScrollManager />
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfumes" element={<CatalogPage />} />
          <Route path="/perfumes/:slug" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
      <CartDrawer />
      <Toast />
    </CartProvider>
  )
}
