import { Link } from 'react-router-dom'
import { CartLines } from '../components/cart/CartLines'
import { TierProgress } from '../components/cart/TierProgress'
import { WholesaleNotice } from '../components/cart/WholesaleNotice'
import { CheckoutForm } from '../components/checkout/CheckoutForm'
import { buttonClass } from '../components/ui/buttonStyles'
import { useCartSummary } from '../hooks/useCartSummary'
import { formatPrice } from '../lib/format'

export default function CartPage() {
  const { ready, lines, summary, mayoristaDesde, modelo } = useCartSummary()
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
      <h1 className="font-display text-3xl font-bold">Tu pedido</h1>
      {!ready ? (
        <p className="mt-6 text-muted" aria-busy>
          Cargando…
        </p>
      ) : lines.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-muted">Tu carrito está vacío.</p>
          <Link to="/#catalogo" className={buttonClass('primary', 'mt-4')}>
            Ver sabores
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <CartLines lines={lines} unitPrice={summary.unitPrice} />
            <TierProgress summary={summary} />
            <dl className="space-y-1 rounded-2xl border border-line bg-surface p-4">
              <div className="flex justify-between text-muted">
                <dt>Precio unitario</dt>
                <dd>{formatPrice(summary.unitPrice)}</dd>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(summary.total)}</dd>
              </div>
            </dl>
          </div>
          <div>
            {summary.isWholesale ? (
              <WholesaleNotice units={summary.totalUnits} from={mayoristaDesde} />
            ) : (
              <CheckoutForm lines={lines} summary={summary} modelo={modelo} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
