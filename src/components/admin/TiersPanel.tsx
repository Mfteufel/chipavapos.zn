import { useState } from 'react'
import type { PriceTier } from '../../data/pricing'
import type { Settings } from '../../data/settings'
import { validateTiers } from '../../lib/adminValidation'
import { formatPrice } from '../../lib/format'
import { saveSettings, saveTiers } from '../../services/adminService'
import { useUiStore } from '../../store/uiStore'
import { buttonClass } from '../ui/buttonStyles'
import { adminInput, Card, Errores, SaveBar } from './AdminUi'

interface Draft {
  filas: { min: string; precio: string }[]
  mayoristaDesde: string
}

const fromData = (tiers: PriceTier[], settings: Settings): Draft => ({
  filas: [...tiers]
    .sort((a, b) => a.min - b.min)
    .map((t) => ({ min: String(t.min), precio: String(t.precioUnitario) })),
  mayoristaDesde: String(settings.mayoristaDesde),
})

const entero = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : NaN)

export function TiersPanel({
  tiers,
  settings,
  onSaved,
}: {
  tiers: PriceTier[]
  settings: Settings
  onSaved: () => Promise<void>
}) {
  const [draft, setDraft] = useState<Draft>(() => fromData(tiers, settings))
  const [saving, setSaving] = useState(false)
  const [errores, setErrores] = useState<string[]>([])
  const toast = useUiStore((s) => s.toast)

  const baseline = fromData(tiers, settings)
  const baselineKey = JSON.stringify(baseline)
  const dirty = JSON.stringify(draft) !== baselineKey

  // Igual que en el panel de sabores: sincronizamos salvo que haya cambios sin guardar.
  const [ultimoCatalogo, setUltimoCatalogo] = useState(baselineKey)
  if (ultimoCatalogo !== baselineKey) {
    setUltimoCatalogo(baselineKey)
    if (!dirty) setDraft(baseline)
  }

  const setFila = (i: number, patch: Partial<Draft['filas'][number]>) =>
    setDraft((d) => ({
      ...d,
      filas: d.filas.map((f, j) => (j === i ? { ...f, ...patch } : f)),
    }))

  const guardar = async () => {
    const parsed: PriceTier[] = draft.filas.map((f) => ({
      min: entero(f.min),
      precioUnitario: entero(f.precio),
    }))
    const errs = validateTiers(parsed)
    const mayorista = entero(draft.mayoristaDesde)
    if (!Number.isInteger(mayorista) || mayorista < 1) {
      errs.push('El mínimo mayorista tiene que ser un número entero de 1 o más.')
    }
    if (errs.length) {
      setErrores(errs)
      return
    }

    setErrores([])
    setSaving(true)
    try {
      if (JSON.stringify(draft.filas) !== JSON.stringify(baseline.filas)) {
        await saveTiers(parsed)
      }
      if (mayorista !== settings.mayoristaDesde) {
        // Partimos de los settings vigentes para no pisar lo que edita el otro panel.
        await saveSettings({ ...settings, mayoristaDesde: mayorista })
      }
      await onSaved()
      toast('Escala de precios guardada')
    } catch (e) {
      setErrores([e instanceof Error ? e.message : 'No se pudo guardar. Probá de nuevo.'])
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card
      title="Escala de precios"
      description="El precio por unidad depende de la cantidad total del carrito, mezclando sabores."
    >
      <div className="space-y-3">
        {draft.filas.map((f, i) => {
          const precio = entero(f.precio)
          return (
            <div key={i} className="flex flex-wrap items-end gap-3 rounded-xl bg-surface2/60 p-3">
              <label className="min-w-24 flex-1 space-y-1.5 text-sm font-semibold">
                <span className="block">Desde (unidades)</span>
                <input
                  inputMode="numeric"
                  className={adminInput}
                  value={f.min}
                  onChange={(e) => setFila(i, { min: e.target.value })}
                />
              </label>
              <label className="min-w-32 flex-[2] space-y-1.5 text-sm font-semibold">
                <span className="block">
                  Precio c/u{' '}
                  <span className="font-normal text-muted">
                    {Number.isInteger(precio) ? formatPrice(precio) : ''}
                  </span>
                </span>
                <input
                  inputMode="numeric"
                  className={adminInput}
                  value={f.precio}
                  onChange={(e) => setFila(i, { precio: e.target.value })}
                />
              </label>
              <button
                type="button"
                aria-label={`Borrar el escalón de ${f.min || '?'} unidades`}
                disabled={draft.filas.length === 1}
                onClick={() =>
                  setDraft((d) => ({ ...d, filas: d.filas.filter((_, j) => j !== i) }))
                }
                className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted hover:text-rose-300 disabled:opacity-40"
              >
                Borrar
              </button>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setDraft((d) => ({ ...d, filas: [...d.filas, { min: '', precio: '' }] }))}
        className={buttonClass('secondary', 'mt-3')}
      >
        + Agregar escalón
      </button>

      <label className="mt-6 block max-w-xs space-y-1.5 text-sm font-semibold">
        <span className="block">Pedido mayorista desde (unidades)</span>
        <input
          inputMode="numeric"
          className={adminInput}
          value={draft.mayoristaDesde}
          onChange={(e) => setDraft((d) => ({ ...d, mayoristaDesde: e.target.value }))}
        />
        <span className="block font-normal text-muted">
          A partir de esta cantidad no se compra online: se consulta por WhatsApp.
        </span>
      </label>

      <div className="mt-5 space-y-3">
        <Errores items={errores} />
        <SaveBar
          dirty={dirty}
          saving={saving}
          onSave={guardar}
          onReset={() => {
            setDraft(fromData(tiers, settings))
            setErrores([])
          }}
        />
      </div>
    </Card>
  )
}
