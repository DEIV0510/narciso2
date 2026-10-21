import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { IconBag, IconClose, IconMenu, IconSearch, IconWhatsApp, IconInstagram, IconTikTok } from './Icons'
import { useCart } from '../context/CartContext'
import useDialog from '../hooks/useDialog'
import { brand, waLink, waMessages } from '../data/site'
import { activePromotions } from '../data/promotions'
import './Header.css'

const LINKS = [
  { to: '/perfumes', label: 'Fragancias' },
  { to: '/#perfil', label: 'Perfil olfativo' },
  ...(activePromotions.length ? [{ to: '/#promociones', label: 'Promociones' }] : []),
  { to: '/#la-casa', label: 'La casa' },
]

export default function Header() {
  const { pathname } = useLocation()
  const { totalItems, openCart, hydrated } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useDialog(menuOpen, () => setMenuOpen(false))
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <header className={`hdr ${overHero ? 'hdr--clear' : 'hdr--solid'}`}>
        <div className="hdr__bar wrap">
          <button
            type="button"
            className="hdr__icon hdr__menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
          >
            <IconMenu />
          </button>

          <nav className="hdr__nav" aria-label="Principal">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className="hdr__link" end>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/" className="hdr__logo" aria-label="Narciso Parfum, inicio">
            <Logo tone="dark" eager height={56} />
          </Link>

          <div className="hdr__actions">
            <Link to="/perfumes#buscar" className="hdr__icon hdr__search" aria-label="Buscar fragancias">
              <IconSearch />
            </Link>
            <a
              className="hdr__wa"
              href={waLink(waMessages.hello)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp />
              <span>Asesoría</span>
            </a>
            <button
              type="button"
              className="hdr__icon hdr__cart"
              onClick={openCart}
              aria-label={`Abrir tu selección (${hydrated ? totalItems : 0} productos)`}
            >
              <IconBag />
              {hydrated && totalItems > 0 && (
                <span key={totalItems} className="hdr__count tabular" aria-hidden="true">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-movil"
        className={`menu ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : ''}
        ref={menuRef}
      >
        <div className="menu__top wrap">
          <Logo tone="dark" height={48} />
          <button type="button" className="hdr__icon" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" data-autofocus>
            <IconClose />
          </button>
        </div>
        <nav className="menu__nav wrap" aria-label="Menú móvil">
          <Link to="/" className="menu__link" style={{ '--i': 0 }}>
            Inicio
          </Link>
          {LINKS.map((l, i) => (
            <Link key={l.to} to={l.to} className="menu__link" style={{ '--i': i + 1 }} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="menu__foot wrap">
          <a className="btn btn--wa btn--block" href={waLink(waMessages.hello)} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp /> Asesoría por WhatsApp
          </a>
          <div className="menu__social">
            <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href={brand.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <IconTikTok />
            </a>
            <span>{brand.city}</span>
          </div>
        </div>
      </div>
    </>
  )
}
