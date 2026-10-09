import { useCartSummary } from '../../hooks/useCartSummary'
import { formatPrice } from '../../lib/format'
import { Section } from '../ui/Section'

export function PriceTable() {
  const { tiers, summary, mayoristaDesde } = useCartSummary()
  const sorted = [...tiers].sort((a, b) => a.min - b.min)
  const label = (i: number) => {
    const t = sorted[i]
    const next = sorted[i + 1]
    if (!next) return `${t.min} o más unidades`
    return next.min - t.min === 1 ? `${t.min} unidad` : `${t.min} a ${next.min - 1} unidades`
  }
  return (
    <Section
      id="precios"
      eyebrow="Precios"
      title="Cuantos más llevás, menos pagás"
      subtitle="El precio se calcula con el total de unidades, mezclando sabores."
    >
      <ul className="grid gap-3 sm:grid-cols-3">
        {sorted.map((t, i) => {
          const current = i === summary.currentTierIndex
          return (
            <li
              key={t.min}
              aria-current={current ? 'true' : undefined}
              className={`rounded-2xl border p-6 ${current ? 'border-brand bg-brand-strong/20' : 'border-line bg-surface'}`}
            >
              <p className="text-muted">{label(i)}</p>
              <p className="mt-2 font-display text-3xl font-bold">
                {formatPrice(t.precioUnitario)}{' '}
                <span className="text-base font-normal text-muted">c/u</span>
              </p>
              {i > 0 && (
                <p className="mt-3 text-sm text-muted">
                  Ahorrás {formatPrice(sorted[0].precioUnitario - t.precioUnitario)} por unidad
                </p>
              )}
              {i === sorted.length - 1 && (
                <p className="mt-3 inline-block rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold text-green-400">
                  Mejor precio
                </p>
              )}
              {current && (
                <p className="mt-3 text-sm font-semibold text-brand">✔ Tu escalón actual</p>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-5 text-muted">
        ¿Más de {mayoristaDesde - 1} unidades? Consultanos por WhatsApp por precio mayorista.
      </p>
    </Section>
  )
}
