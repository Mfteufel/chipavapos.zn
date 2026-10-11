import type { ReactNode } from 'react'
import { buttonClass } from '../ui/buttonStyles'

export const adminInput =
  'min-h-11 w-full rounded-lg border border-line bg-surface2 px-3 text-base text-white placeholder:text-neutral-500 focus:border-brand'

export function Card({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function Errores({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul role="alert" className="space-y-1 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
      {items.map((e) => (
        <li key={e} className="text-sm text-rose-300">
          {e}
        </li>
      ))}
    </ul>
  )
}

/** Barra de guardado: solo se habilita si hay cambios sin guardar. */
export function SaveBar({
  dirty,
  saving,
  onSave,
  onReset,
}: {
  dirty: boolean
  saving: boolean
  onSave: () => void
  onReset: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty || saving}
        className={buttonClass('primary')}
      >
        {saving ? 'Guardando…' : 'Guardar cambios'}
      </button>
      {dirty && !saving && (
        <button type="button" onClick={onReset} className={buttonClass('ghost')}>
          Descartar
        </button>
      )}
      {dirty && !saving && <span className="text-sm text-amber-300">Hay cambios sin guardar</span>}
    </div>
  )
}
