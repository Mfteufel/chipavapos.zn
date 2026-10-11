import { useState } from 'react'
import type { Product } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { updateProduct } from '../../services/adminService'
import { useUiStore } from '../../store/uiStore'
import { adminInput, Card, Errores, SaveBar } from './AdminUi'

/** Los números se guardan como texto mientras se edita y se parsean recién al guardar. */
interface Draft {
  stock: string
  precio: string
  esPromo: boolean
}

type Drafts = Record<string, Draft>

const fromProducts = (products: Product[]): Drafts =>
  Object.fromEntries(
    products.map((p) => [
      p.id,
      { stock: String(p.stock), precio: String(p.precio), esPromo: p.esPromo },
    ]),
  )

const entero = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : NaN)

export function ProductsPanel({
  products,
  onSaved,
}: {
  products: Product[]
  onSaved: () => Promise<void>
}) {
  const [drafts, setDrafts] = useState<Drafts>(() => fromProducts(products))
  const [saving, setSaving] = useState(false)
  const [errores, setErrores] = useState<string[]>([])
  const toast = useUiStore((s) => s.toast)

  const baseline = fromProducts(products)
  const baselineKey = JSON.stringify(baseline)
  const dirty = JSON.stringify(drafts) !== baselineKey

  // Cuando el catálogo se recarga sincronizamos el formulario, pero si hay
  // cambios sin guardar los dejamos: pisarlos sería perder trabajo del dueño.
  const [ultimoCatalogo, setUltimoCatalogo] = useState(baselineKey)
  if (ultimoCatalogo !== baselineKey) {
    setUltimoCatalogo(baselineKey)
    if (!dirty) setDrafts(baseline)
  }

  const set = (id: string, patch: Partial<Draft>) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }))

  const guardar = async () => {
    const errs: string[] = []
    for (const p of products) {
      const d = drafts[p.id]
      if (!Number.isInteger(entero(d.stock)))
        errs.push(`El stock de ${p.nombre} tiene que ser un número entero de 0 o más.`)
      if (!Number.isInteger(entero(d.precio)))
        errs.push(`El precio de ${p.nombre} tiene que ser un número entero de 0 o más.`)
    }
    if (errs.length) {
      setErrores(errs)
      return
    }

    setErrores([])
    setSaving(true)
    try {
      // Solo mandamos los que cambiaron.
      const cambiados = products.filter(
        (p) => JSON.stringify(drafts[p.id]) !== JSON.stringify(baseline[p.id]),
      )
      for (const p of cambiados) {
        const d = drafts[p.id]
        await updateProduct(p.id, {
          stock: entero(d.stock),
          precio: entero(d.precio),
          esPromo: d.esPromo,
        })
      }
      await onSaved()
      toast(`Guardado: ${cambiados.length} sabor${cambiados.length === 1 ? '' : 'es'}`)
    } catch (e) {
      setErrores([e instanceof Error ? e.message : 'No se pudo guardar. Probá de nuevo.'])
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card
      title="Sabores"
      description="Stock, precio de lista y promo. Para marcar un sabor como sin stock, poné 0."
    >
      <div className="space-y-4">
        {products.map((p) => {
          const d = drafts[p.id]
          if (!d) return null
          const sinStock = entero(d.stock) === 0
          return (
            <div key={p.id} className="rounded-xl border border-line bg-surface2/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  <span aria-hidden>{p.emoji}</span> {p.nombre}
                </h3>
                {sinStock && (
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300">
                    Sin stock
                  </span>
                )}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-semibold">
                  <span className="block">Stock (unidades)</span>
                  <input
                    inputMode="numeric"
                    className={adminInput}
                    value={d.stock}
                    onChange={(e) => set(p.id, { stock: e.target.value })}
                  />
                </label>
                <label className="space-y-1.5 text-sm font-semibold">
                  <span className="block">
                    Precio de lista{' '}
                    <span className="font-normal text-muted">
                      {Number.isInteger(entero(d.precio)) ? formatPrice(entero(d.precio)) : ''}
                    </span>
                  </span>
                  <input
                    inputMode="numeric"
                    className={adminInput}
                    value={d.precio}
                    onChange={(e) => set(p.id, { precio: e.target.value })}
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    className="size-4 accent-violet-500"
                    checked={d.esPromo}
                    onChange={(e) => set(p.id, { esPromo: e.target.checked })}
                  />
                  En promo
                </label>
                <button
                  type="button"
                  onClick={() => set(p.id, { stock: '0' })}
                  className="text-sm font-semibold text-muted underline hover:text-white"
                >
                  Marcar sin stock
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 space-y-3">
        <Errores items={errores} />
        <SaveBar
          dirty={dirty}
          saving={saving}
          onSave={guardar}
          onReset={() => {
            setDrafts(fromProducts(products))
            setErrores([])
          }}
        />
      </div>
    </Card>
  )
}
