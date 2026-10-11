import { useCatalog } from '../../hooks/useCatalog'
import { ClockIcon, PinIcon } from '../ui/Icons'
import { Section } from '../ui/Section'

export function ShippingZones() {
  const { settings, ready } = useCatalog()

  return (
    <Section
      id="envios"
      eyebrow="Envíos"
      title="Zonas de envío"
      subtitle="Estas son las localidades a las que llegamos."
    >
      <div className="grid gap-5 md:grid-cols-5">
        <ul className="grid gap-3 sm:grid-cols-2 md:col-span-3" aria-busy={!ready}>
          {ready
            ? settings.zonas.map((z) => (
                <li
                  key={z}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5"
                >
                  <PinIcon className="size-5 shrink-0 text-brand" />
                  {z}
                </li>
              ))
            : // Placeholders para no mover el layout mientras carga.
              [0, 1, 2, 3].map((i) => (
                <li key={i} className="h-[52px] animate-pulse rounded-xl bg-surface" />
              ))}
        </ul>
        <div className="rounded-2xl border border-brand/40 bg-gradient-to-br from-brand-strong/20 to-surface p-6 md:col-span-2">
          <ClockIcon className="size-7 text-brand" />
          <h3 className="mt-3 font-semibold">Horario de envíos</h3>
          <p className="mt-1 font-display text-3xl font-bold">
            {ready ? `${settings.horario.desde} a ${settings.horario.hasta} hs` : '—'}
          </p>
          <p className="mt-2 text-muted">
            Te avisamos por WhatsApp cuando salimos a llevarte tu pedido.
          </p>
        </div>
      </div>
    </Section>
  )
}
