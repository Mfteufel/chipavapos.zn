import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { buttonClass } from '../components/ui/buttonStyles'
import { useCatalog } from '../hooks/useCatalog'
import NotFoundPage from './NotFoundPage'

export default function ProductPage() {
  const { slug } = useParams()
  const { products, tiers, status, modelo } = useCatalog()
  if (status !== 'ready')
    return (
      <p className="px-4 pt-28 text-muted" aria-busy>
        Cargando…
      </p>
    )
  const product = products.find((p) => p.slug === slug)
  if (!product) return <NotFoundPage />
  const best = Math.min(...tiers.map((t) => t.precioUnitario))
  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-24">
      <Link to="/#catalogo" className="text-sm text-muted hover:text-white">
        ← Todos los sabores
      </Link>
      <h1 className="mb-4 mt-3 font-display text-2xl font-bold">
        {modelo} · {product.nombre}
      </h1>
      <ProductCard product={product} fromPrice={best} />
      <Link to="/carrito" className={buttonClass('secondary', 'mt-4 w-full')}>
        Ir al carrito
      </Link>
    </div>
  )
}
