export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="rounded-full bg-neutral-700 px-3 py-1 text-xs font-bold">Sin stock</span>
    )
  if (stock <= 2)
    return (
      <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-neutral-950">
        ¡Últimas {stock}!
      </span>
    )
  return null
}
