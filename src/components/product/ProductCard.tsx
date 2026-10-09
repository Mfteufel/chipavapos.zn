import { m } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../data/products'
import { ACCENT } from '../../lib/accent'
import { formatPrice } from '../../lib/format'
import { remainingStock } from '../../lib/pricing'
import { useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'
import { Button } from '../ui/Button'
import { ProductImage } from './ProductImage'
import { QuantitySelector } from './QuantitySelector'
import { StockBadge } from './StockBadge'

export function ProductCard({ product, fromPrice }: { product: Product; fromPrice: number }) {
  const [qty, setQty] = useState(1)
  const inCart = useCartStore((s) => s.lines.find((l) => l.productId === product.id)?.quantity ?? 0)
  const add = useCartStore((s) => s.add)
  const toast = useUiStore((s) => s.toast)
  const accent = ACCENT[product.acento]
  const available = remainingStock(product.stock, inCart)
  const selectable = Math.max(1, Math.min(qty, available))

  const handleAdd = () => {
    const added = add(product.id, selectable, product.stock)
    if (added > 0) {
      toast(`${product.emoji} ${product.nombre} x${added} al carrito`)
      setQty(1)
    }
  }

  return (
    <m.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-surface transition-colors ${accent.border} ${accent.ring}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent.glow} to-transparent opacity-60`}
      />
      <div className="relative">
        <Link to={`/producto/${product.slug}`} aria-label={`Ver detalle de ${product.nombre}`}>
          <ProductImage product={product} className="aspect-square w-full" />
        </Link>
        <div className="absolute left-3 top-3 flex gap-2">
          <StockBadge stock={product.stock} />
          {product.esPromo && (
            <span className="rounded-full bg-brand-strong px-3 py-1 text-xs font-bold">Promo</span>
          )}
        </div>
      </div>
      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className={`font-display text-2xl font-bold ${accent.text}`}>
            <span aria-hidden>{product.emoji}</span> {product.nombre}
          </h3>
          <p className="mt-1 text-muted">{product.descripcion}</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{formatPrice(product.precio)}</p>
          <p className="text-sm text-muted">
            Hasta {formatPrice(fromPrice)} c/u llevando más unidades
          </p>
        </div>
        {product.stock === 0 ? (
          <Button disabled className="mt-auto w-full">
            Sin stock
          </Button>
        ) : available === 0 ? (
          <p className="mt-auto rounded-xl bg-surface2 p-3 text-center text-sm text-muted">
            Ya tenés todo el stock disponible en el carrito ({inCart})
          </p>
        ) : (
          <div className="mt-auto flex items-center justify-between gap-3">
            <QuantitySelector
              label={`Cantidad de ${product.nombre}`}
              value={selectable}
              max={available}
              onChange={setQty}
            />
            <Button onClick={handleAdd} className={`flex-1 ${accent.button}`}>
              Agregar
            </Button>
          </div>
        )}
      </div>
    </m.article>
  )
}
