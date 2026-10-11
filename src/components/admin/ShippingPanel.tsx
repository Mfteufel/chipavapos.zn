import { useState } from 'react'
import type { Settings } from '../../data/settings'
import { normalizeSettings, validateSettings } from '../../lib/adminValidation'
import { saveSettings } from '../../services/adminService'
import { useUiStore } from '../../store/uiStore'
import { buttonClass } from '../ui/buttonStyles'
import { adminInput, Card, Errores, SaveBar } from './AdminUi'

interface Draft {
  modelo: string
  desde: string
  hasta: string
  zonas: string[]
}

const fromSettings = (s: Settings): Draft => ({
  modelo: s.modelo,
  desde: s.horario.desde,
  hasta: s.horario.hasta,
  zonas: [...s.zonas],
})

export function ShippingPanel({
  settings,
  onSaved,
}: {
  settings: Settings
  onSaved: () => Promise<void>
}) {
  const [draft, setDraft] = useState<Draft>(() => fromSettings(settings))
  const [saving, setSaving] = useState(false)
  const [errores, setErrores] = useState<string[]>([])
  const toast = useUiStore((s) => s.toast)

  const baseline = fromSettings(settings)
  const baselineKey = JSON.stringify(baseline)
  const dirty = JSON.stringify(draft) !== baselineKey

  // Igual que en el panel de sabores: sincronizamos salvo que haya cambios sin guardar.
  const [ultimoCatalogo, setUltimoCatalogo] = useState(baselineKey)
  if (ultimoCatalogo !== baselineKey) {
    setUltimoCatalogo(baselineKey)
    if (!dirty) setDraft(baseline)
  }

  const guardar = async () => {
    // Partimos de los settings vigentes para no pisar el mínimo mayorista del otro panel.
    const nuevos = normalizeSettings({
      ...settings,
      modelo: draft.modelo,
      horario: { desde: draft.desde, hasta: draft.hasta },
      zonas: draft.zonas,
    })
    const errs = validateSettings(nuevos)
    if (errs.length) {
      setErrores(errs)
      return
    }

    setErrores([])
    setSaving(true)
    try {
      await saveSettings(nuevos)
      await onSaved()
      toast('Envíos actualizados')
    } catch (e) {
      setErrores([e instanceof Error ? e.message : 'No se pudo guardar. Probá de nuevo.'])
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title="Envíos y modelo" description="Horario, zonas y el nombre del producto.">
      <div className="space-y-5">
        <label className="block max-w-sm space-y-1.5 text-sm font-semibold">
          <span className="block">Modelo</span>
          <input
            className={adminInput}
            value={draft.modelo}
            onChange={(e) => setDraft((d) => ({ ...d, modelo: e.target.value }))}
          />
        </label>

        <fieldset className="space-y-1.5">
          <legend className="text-sm font-semibold">Horario de envíos</legend>
          <div className="flex items-center gap-3">
            <input
              type="time"
              aria-label="Desde"
              className={`${adminInput} max-w-36`}
              value={draft.desde}
              onChange={(e) => setDraft((d) => ({ ...d, desde: e.target.value }))}
            />
            <span className="text-muted">a</span>
            <input
              type="time"
              aria-label="Hasta"
              className={`${adminInput} max-w-36`}
              value={draft.hasta}
              onChange={(e) => setDraft((d) => ({ ...d, hasta: e.target.value }))}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Zonas de envío</legend>
          {draft.zonas.map((z, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                aria-label={`Zona ${i + 1}`}
                className={`${adminInput} max-w-sm`}
                value={z}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    zonas: d.zonas.map((v, j) => (j === i ? e.target.value : v)),
                  }))
                }
              />
              <button
                type="button"
                aria-label={`Borrar ${z || `zona ${i + 1}`}`}
                onClick={() =>
                  setDraft((d) => ({ ...d, zonas: d.zonas.filter((_, j) => j !== i) }))
                }
                className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted hover:text-rose-300"
              >
                Borrar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, zonas: [...d.zonas, ''] }))}
            className={buttonClass('secondary', 'mt-1')}
          >
            + Agregar zona
          </button>
        </fieldset>
      </div>

      <div className="mt-5 space-y-3">
        <Errores items={errores} />
        <SaveBar
          dirty={dirty}
          saving={saving}
          onSave={guardar}
          onReset={() => {
            setDraft(fromSettings(settings))
            setErrores([])
          }}
        />
      </div>
    </Card>
  )
}
