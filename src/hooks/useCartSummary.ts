import { useEffect, useMemo } from 'react'
import type { Product } from '../data/products'
import { clampQuantity, summarizeCart } from '../lib/pricing'
import { useCartStore } from '../store/cartStore'
import { useCatalog } from './useCatalog'

export interface DetailedLine {
  product: Product
  quantity: number
}

/** Une carrito + catálogo: líneas con producto, ajustadas al stock, y resumen de precios. */
export function useCartSummary() {
  const { products, tiers, mayoristaDesde, status, modelo } = useCatalog()
  const lines = useCartStore((s) => s.lines)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)

  const ready = status === 'ready'

  const detailed = useMemo<DetailedLine[]>(() => {
    if (!ready) return []
    return lines.flatMap((l) => {
      const product = products.find((p) => p.id === l.productId)
      if (!product) return []
      const quantity = clampQuantity(l.quantity, product.stock)
      return quantity > 0 ? [{ product, quantity }] : []
    })
  }, [lines, products, ready])

  // Si el stock bajó (o un producto se eliminó), corregimos el carrito persistido.
  useEffect(() => {
    if (!ready) return
    for (const l of lines) {
      const product = products.find((p) => p.id === l.productId)
      if (!product) remove(l.productId)
      else if (l.quantity > product.stock) setQuantity(l.productId, product.stock, product.stock)
    }
  }, [ready, lines, products, setQuantity, remove])

  const summary = useMemo(
    () =>
      summarizeCart(
        detailed.map((d) => ({ productId: d.product.id, quantity: d.quantity })),
        tiers,
        mayoristaDesde,
      ),
    [detailed, tiers, mayoristaDesde],
  )

  return { ready, lines: detailed, summary, tiers, mayoristaDesde, products, modelo }
}
