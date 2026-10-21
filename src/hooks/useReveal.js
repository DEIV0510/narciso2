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
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
