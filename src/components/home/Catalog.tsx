import { useCatalog } from '../../hooks/useCatalog'
import { ProductCard } from '../product/ProductCard'
import { Section } from '../ui/Section'

export function Catalog() {
  const { products, tiers, status } = useCatalog()
  const best = tiers.length ? Math.min(...tiers.map((t) => t.precioUnitario)) : 0
  return (
    <Section
      id="catalogo"
      eyebrow="Catálogo"
      title="Elegí tu sabor"
      subtitle="Podés combinar sabores: el precio baja según el total de unidades."
    >
      {status === 'error' ? (
        <p role="alert" className="text-rose-400">
          No pudimos cargar los productos. Probá de nuevo en un rato.
        </p>
      ) : status !== 'ready' ? (
        <div className="grid gap-5 md:grid-cols-3" aria-busy>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[28rem] animate-pulse rounded-3xl bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} fromPrice={best} />
          ))}
        </div>
      )}
    </Section>
  )
}
