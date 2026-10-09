import type { DetailedLine } from '../../hooks/useCartSummary'
import { ACCENT } from '../../lib/accent'
import { formatPrice } from '../../lib/format'
import { useCartStore } from '../../store/cartStore'
import { ProductImage } from '../product/ProductImage'
import { QuantitySelector } from '../product/QuantitySelector'

export function CartLines({ lines, unitPrice }: { lines: DetailedLine[]; unitPrice: number }) {
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)
  return (
    <ul className="space-y-3">
      {lines.map(({ product, quantity }) => (
        <li key={product.id} className="flex gap-3 rounded-2xl border border-line bg-surface p-3">
          <ProductImage product={product} className="size-20 shrink-0 rounded-xl text-4xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <p className={`font-semibold ${ACCENT[product.acento].text}`}>
                {product.emoji} {product.nombre}
              </p>
              <button
                type="button"
                onClick={() => remove(product.id)}
                aria-label={`Quitar ${product.nombre} del carrito`}
                className="flex size-9 items-center justify-center rounded-lg text-muted hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-between">
              <QuantitySelector
                label={`Cantidad de ${product.nombre}`}
                value={quantity}
                max={product.stock}
                onChange={(n) => setQuantity(product.id, n, product.stock)}
              />
              <p className="font-semibold">{formatPrice(unitPrice * quantity)}</p>
            </div>
            {quantity >= product.stock && (
              <p className="text-xs text-amber-400">Máximo disponible</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
