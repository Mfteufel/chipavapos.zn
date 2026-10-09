import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCartSummary } from '../../hooks/useCartSummary'
import { formatPrice } from '../../lib/format'
import { useUiStore } from '../../store/uiStore'
import { buttonClass } from '../ui/buttonStyles'
import { CartLines } from './CartLines'
import { TierProgress } from './TierProgress'
import { WholesaleNotice } from './WholesaleNotice'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUiStore()
  const { lines, summary, mayoristaDesde } = useCartSummary()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!cartOpen) return
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      prevFocus?.focus?.()
    }
  }, [cartOpen, closeCart])

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/70"
            aria-hidden
          />
          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute inset-y-0 right-0 flex w-full flex-col bg-bg sm:max-w-md sm:border-l sm:border-line"
          >
            <div className="flex items-center justify-between border-b border-line p-4">
              <h2 className="font-display text-xl font-bold">Tu carrito</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="flex size-11 items-center justify-center rounded-xl border border-line hover:border-brand"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <div className="py-16 text-center text-muted">
                  <p className="text-5xl" aria-hidden>
                    🛒
                  </p>
                  <p className="mt-3">Todavía no agregaste nada.</p>
                </div>
              ) : (
                <>
                  <CartLines lines={lines} unitPrice={summary.unitPrice} />
                  <TierProgress summary={summary} />
                  {summary.isWholesale && (
                    <WholesaleNotice units={summary.totalUnits} from={mayoristaDesde} />
                  )}
                </>
              )}
            </div>
            {lines.length > 0 && (
              <div className="space-y-3 border-t border-line p-4">
                <div className="flex items-center justify-between text-lg">
                  <span>Total</span>
                  <strong>{formatPrice(summary.total)}</strong>
                </div>
                {!summary.isWholesale && (
                  <Link
                    to="/carrito"
                    onClick={closeCart}
                    className={buttonClass('primary', 'w-full')}
                  >
                    Finalizar pedido
                  </Link>
                )}
              </div>
            )}
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
