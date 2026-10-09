import { useLocation } from 'react-router-dom'
import { useCartSummary } from '../../hooks/useCartSummary'
import { formatPrice } from '../../lib/format'
import { useUiStore } from '../../store/uiStore'

export function FloatingCartButton() {
  const { summary } = useCartSummary()
  const { cartOpen, openCart } = useUiStore()
  const { pathname } = useLocation()
  if (summary.totalUnits === 0 || cartOpen || pathname === '/carrito') return null
  return (
    <button
      type="button"
      onClick={openCart}
      className="fixed inset-x-4 bottom-4 z-40 flex min-h-14 items-center justify-between rounded-2xl bg-brand-strong px-5 font-semibold text-white shadow-xl shadow-black/50 md:hidden"
    >
      <span>🛒 Ver carrito ({summary.totalUnits})</span>
      <span>{formatPrice(summary.total)}</span>
    </button>
  )
}
