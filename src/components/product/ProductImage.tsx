import { useState } from 'react'
import type { Product } from '../../data/products'
import { ACCENT } from '../../lib/accent'

/** Imagen del producto con placeholder (emoji + color) si el archivo no carga. */
export function ProductImage({
  product,
  className = '',
}: {
  product: Product
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        role="img"
        aria-label={`ELFBAR KING 40K sabor ${product.nombre}`}
        className={`flex items-center justify-center bg-gradient-to-br ${ACCENT[product.acento].glow} to-surface text-7xl ${className}`}
      >
        {product.emoji}
      </div>
    )
  }
  return (
    <img
      src={product.imagen}
      alt={`Vape ELFBAR KING 40K sabor ${product.nombre}`}
      width={400}
      height={400}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}
