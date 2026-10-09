import { formatPrice } from '../../lib/format'
import type { CartSummary } from '../../lib/pricing'

export function TierProgress({ summary }: { summary: CartSummary }) {
  const { nextTier, savings, isWholesale } = summary
  if (summary.totalUnits === 0 || isWholesale) return null
  return (
    <div className="space-y-2 rounded-2xl border border-line bg-surface2 p-4 text-sm">
      {nextTier ? (
        <p>
          💡 Agregá <strong>{nextTier.faltan} más</strong> y pagás{' '}
          <strong>{formatPrice(nextTier.precioUnitario)} c/u</strong>
        </p>
      ) : (
        <p>🎉 ¡Ya tenés el mejor precio por unidad!</p>
      )}
      {savings > 0 && (
        <p className="text-green-400">
          Estás ahorrando <strong>{formatPrice(savings)}</strong>
        </p>
      )}
    </div>
  )
}
