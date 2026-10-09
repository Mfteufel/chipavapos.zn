import type { ComponentType, SVGProps } from 'react'
import { BankIcon, TruckIcon, WindIcon } from '../ui/Icons'

const ITEMS: { icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; text: string }[] = [
  { icon: TruckIcon, title: 'Envío en Zona Norte', text: 'Te lo llevamos a tu casa.' },
  { icon: BankIcon, title: 'Efectivo o transferencia', text: 'Pagás como te quede cómodo.' },
  { icon: WindIcon, title: '40.000 puffs', text: 'Hasta 40K caladas por vape.' },
]

export function Benefits() {
  return (
    <section aria-label="Beneficios" className="mx-auto grid max-w-6xl gap-3 px-4 sm:grid-cols-3">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-strong/20 text-brand">
            <Icon className="size-6" />
          </span>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted">{text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
