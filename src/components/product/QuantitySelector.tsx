interface Props {
  value: number
  min?: number
  max: number
  onChange: (n: number) => void
  label: string
}

export function QuantitySelector({ value, min = 1, max, onChange, label }: Props) {
  const btn =
    'flex size-11 items-center justify-center rounded-xl border border-line bg-surface2 text-xl font-bold hover:border-brand disabled:opacity-40'
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-3">
      <button
        type="button"
        className={btn}
        aria-label="Quitar una unidad"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output aria-live="polite" className="w-8 text-center text-lg font-semibold">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        aria-label="Agregar una unidad"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
