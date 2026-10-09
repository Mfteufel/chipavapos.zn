import { BankIcon, CashIcon } from '../ui/Icons'
import { Section } from '../ui/Section'

const METHODS = [
  {
    icon: CashIcon,
    title: 'Efectivo',
    text: 'Pagás al recibir. Avisanos con cuánto pagás para llevar cambio.',
  },
  {
    icon: BankIcon,
    title: 'Transferencia',
    text: 'Te pasamos el alias y mandás el comprobante por WhatsApp.',
  },
]

export function PaymentMethods() {
  return (
    <Section id="pagos" eyebrow="Pagos" title="Medios de pago">
      <div className="grid gap-4 sm:grid-cols-2">
        {METHODS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4 rounded-2xl border border-line bg-surface p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-strong/20 text-brand">
              <Icon className="size-6" />
            </span>
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-1 text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
