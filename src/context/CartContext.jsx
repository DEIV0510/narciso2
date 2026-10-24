import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { getProductById } from '../data/products'

// Misma clave que el sitio anterior: quien tenga un carrito guardado en
// narcisoparfum.com no lo pierde al publicar este rediseño.
const STORAGE_KEY = 'narciso-cart-v1'
const MAX_QTY = 20

// Presentación por defecto para productos sin tamaño fijo (Torino21 y
// Unstoppable Hong Kong). No se muestra en el carrito ni en el pedido.
export const DEFAULT_SIZE_LABEL = 'Presentación'

const lineId = (productId, sizeLabel) => `${productId}__${sizeLabel}`

// Precio, nombre e imagen salen SIEMPRE del catálogo vigente, nunca de lo
// guardado en el navegador: si un precio cambia o un producto se retira, el
// carrito guardado se corrige solo al cargar.
function resolveLine(productId, rawSizeLabel, qty) {
  const product = getProductById(productId)
  if (!product) return null
  // Carritos del sitio anterior guardaban 'Presentación' en productos que hoy
  // tienen tamaño real (50 ml): se pasan a ese tamaño.
  const sizeLabel =
    rawSizeLabel === DEFAULT_SIZE_LABEL && product.sizes?.length ? product.sizes[0].label : rawSizeLabel
  const size = product.sizes?.find((s) => s.label === sizeLabel)
  const price = size ? size.price : sizeLabel === DEFAULT_SIZE_LABEL ? product.price : null
  if (price == null) return null
  return {
    lineId: lineId(productId, sizeLabel),
    productId,
    name: product.name || null,
    title: product.title,
    brand: product.brand,
    fullName: product.fullName,
    image: product.image,
    sizeLabel,
    price,
    qty: Math.min(MAX_QTY, Math.max(1, Math.floor(qty) || 1)),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.items
    case 'ADD': {
      const id = lineId(action.productId, action.sizeLabel)
      const existing = state.find((i) => i.lineId === id)
      if (existing) {
        return state.map((i) => (i.lineId === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.qty) } : i))
      }
      const line = resolveLine(action.productId, action.sizeLabel, action.qty)
      return line ? [...state, line] : state
    }
    case 'SET_QTY':
      return state
        .map((i) => (i.lineId === action.lineId ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i))
        .filter((i) => i.qty > 0)
    case 'REMOVE':
      return state.filter((i) => i.lineId !== action.lineId)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

// Carrito guardado → líneas resueltas contra el catálogo vigente.
function readSaved(raw) {
  const saved = JSON.parse(raw || '[]')
  return Array.isArray(saved) ? saved.map((i) => resolveLine(i.productId, i.sizeLabel, i.qty)).filter(Boolean) : []
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])
  const itemsRef = useRef(items)
  itemsRef.current = items
  const skipSave = useRef(false)
  const [hydrated, setHydrated] = useState(false)
  // 'closed' | 'cart' | 'checkout' | 'sent'
  const [view, setView] = useState('closed')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(0)

  // Se hidrata una vez; el guardado solo corre después (si no, el primer render
  // con [] pisaría el carrito guardado — visible con StrictMode en desarrollo).
  useEffect(() => {
    try {
      dispatch({ type: 'HYDRATE', items: readSaved(localStorage.getItem(STORAGE_KEY)) })
    } catch {
      // almacenamiento no disponible o JSON dañado: carrito vacío
    }
    setHydrated(true)
  }, [])

  // Otra pestaña cambió el carrito: se refleja aquí sin volver a escribirlo
  // (si no, cada pestaña pisaría lo que agregó o vació la otra).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== null && e.key !== STORAGE_KEY) return // key null = localStorage.clear()
      try {
        const next = readSaved(e.newValue)
        skipSave.current = true
        dispatch({ type: 'HYDRATE', items: next })
      } catch {
        // JSON dañado: se conserva lo que hay
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // sin almacenamiento: la compra sigue funcionando en esta visita
    }
  }, [items, hydrated])

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }, [])

  const addItem = useCallback(
    (product, { sizeLabel, qty = 1, silent = false } = {}) => {
      const label = sizeLabel || product.sizes?.[0]?.label || DEFAULT_SIZE_LABEL
      const current = itemsRef.current.find((i) => i.lineId === lineId(product.id, label))?.qty ?? 0
      dispatch({ type: 'ADD', productId: product.id, sizeLabel: label, qty })
      // El tope se avisa siempre (también en añadidos silenciosos): el cliente
      // no debe creer que lleva unidades que no quedan en el pedido.
      if (current + qty > MAX_QTY) notify(`Máximo ${MAX_QTY} unidades por presentación. Para más, escríbenos por WhatsApp.`)
      else if (!silent) notify(`${product.name || product.title} se agregó a tu selección`)
    },
    [notify]
  )

  const setQty = useCallback((id, qty) => dispatch({ type: 'SET_QTY', lineId: id, qty }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', lineId: id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])

  const value = useMemo(
    () => ({
      items,
      hydrated,
      totalItems,
      subtotal,
      view,
      setView,
      openCart: () => setView('cart'),
      closeCart: () => setView('closed'),
      toast,
      notify,
      addItem,
      setQty,
      removeItem,
      clearCart,
      maxQty: MAX_QTY,
    }),
    [items, hydrated, totalItems, subtotal, view, toast, notify, addItem, setQty, removeItem, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
