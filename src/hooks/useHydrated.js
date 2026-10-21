import { useEffect, useState } from 'react'

// false en el prerender y en el primer render del cliente (para que el HTML
// coincida al hidratar); true justo después.
export default function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
