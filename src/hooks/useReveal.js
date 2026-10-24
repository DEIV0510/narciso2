import { useEffect } from 'react'

// Aparición progresiva: cualquier elemento con [data-reveal] recibe
// .is-visible al entrar en pantalla. Un solo observer para toda la página.
// Sin JS o con movimiento reducido, el CSS los muestra directamente.
export default function useReveal(deps = []) {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-reveal]:not(.is-visible)')]
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    // Chrome descuenta el clip-path del propio objetivo: un .curtain con
    // inset(100%) nunca supera el umbral. Se observa su padre (sin recorte),
    // que puede agrupar varios elementos.
    const groups = new Map()
    for (const el of els) {
      const target = el.classList.contains('curtain') && el.parentElement ? el.parentElement : el
      if (!groups.has(target)) groups.set(target, [])
      groups.get(target).push(el)
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          groups.get(e.target)?.forEach((el) => el.classList.add('is-visible'))
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    groups.forEach((_, target) => io.observe(target))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
