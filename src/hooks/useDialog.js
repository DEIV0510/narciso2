import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// Panel modal accesible: bloquea el scroll, atrapa el foco, cierra con Escape
// y devuelve el foco a donde estaba al cerrar.
export default function useDialog(open, onClose) {
  const ref = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.classList.add('is-locked')
    document.documentElement.style.setProperty('--scrollbar', `${scrollbar}px`)
    const t = setTimeout(() => {
      const target = ref.current?.querySelector('[data-autofocus]') || ref.current?.querySelector(FOCUSABLE)
      target?.focus({ preventScroll: true })
    }, 60)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !ref.current) return
      const items = [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('is-locked')
      previous?.focus?.({ preventScroll: true })
    }
  }, [open])

  return ref
}
