import { useId, useState } from 'react'

interface Item {
  pregunta: string
  respuesta: string
}

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.pregunta}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                id={`${base}-btn-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:bg-surface2"
              >
                {it.pregunta}
                <span
                  aria-hidden
                  className={`text-brand transition-transform ${isOpen ? 'rotate-45' : ''}`}
                >
                  ＋
                </span>
              </button>
            </h3>
            <div
              id={`${base}-${i}`}
              role="region"
              aria-labelledby={`${base}-btn-${i}`}
              hidden={!isOpen}
              className="px-5 pb-5 text-muted"
            >
              {it.respuesta}
            </div>
          </div>
        )
      })}
    </div>
  )
}
