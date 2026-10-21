import { useCart } from '../context/CartContext'
import { IconCheck } from './Icons'
import './Toast.css'

export default function Toast() {
  const { toast, openCart } = useCart()
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          <IconCheck />
          <span>{toast.message}</span>
          <button type="button" onClick={openCart}>
            Ver
          </button>
        </div>
      )}
    </div>
  )
}
