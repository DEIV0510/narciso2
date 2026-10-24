import { useEffect, useState } from 'react'

// false en el prerender y en el primer render del cliente (para que el HTML
// coincida al hidratar); true justo después. Tras la primera hidratación, las
// páginas que se montan al navegar ya empiezan en true (sin cuadro intermedio).
let hydratedOnce = false

export default function useHydrated() {
  const [hydrated, setHydrated] = useState(hydratedOnce)
  useEffect(() => {
    hydratedOnce = true
    setHydrated(true)
  }, [])
  return hydrated
}
