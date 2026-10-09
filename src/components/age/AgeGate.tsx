import { useEffect, useRef, type ReactNode } from 'react'
import { BUSINESS_NAME } from '../../config'
import { useAgeGate } from '../../hooks/useAgeGate'

/** Bloquea toda la app hasta que la persona confirme que es mayor de 18. */
export function AgeGate({ children }: { children: ReactNode }) {
  const { answer, respond } = useAgeGate()
  const yesRef = useRef<HTMLButtonElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (answer !== 'unknown') return
    yesRef.current?.focus()
    // Sin Escape ni clic afuera; el foco queda atrapado entre los dos botones.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault()
      if (e.key === 'Tab') {
        e.preventDefault()
        const next = document.activeElement === yesRef.current ? noRef.current : yesRef.current
        next?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [answer])

  if (answer === 'yes') return <>{children}</>

  if (answer === 'no') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-6xl" aria-hidden>
          🚫
        </p>
        <h1 className="font-display text-3xl font-bold">Lo sentimos</h1>
        <p className="max-w-sm text-muted">
          Este sitio es solo para mayores de 18 años. No podés ver el catálogo.
        </p>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg/95 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-title"
        className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 text-center"
      >
        <p className="font-display text-sm font-bold uppercase tracking-widest text-brand">
          {BUSINESS_NAME}
        </p>
        <h1 id="age-title" className="mt-3 font-display text-3xl font-bold">
          ¿Sos mayor de 18 años?
        </h1>
        <p className="mt-2 text-muted">La venta es exclusiva para mayores de edad.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={yesRef}
            type="button"
            onClick={() => respond('yes')}
            className="min-h-12 rounded-xl bg-brand-strong font-semibold text-white hover:bg-violet-600"
          >
            Sí
          </button>
          <button
            ref={noRef}
            type="button"
            onClick={() => respond('no')}
            className="min-h-12 rounded-xl border border-line bg-surface2 font-semibold hover:border-brand"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
