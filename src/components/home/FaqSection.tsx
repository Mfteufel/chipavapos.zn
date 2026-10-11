import { useMemo } from 'react'
import { buildFaq } from '../../data/faq'
import { useCatalog } from '../../hooks/useCatalog'
import { Accordion } from '../ui/Accordion'
import { Section } from '../ui/Section'

export function FaqSection() {
  const { settings, ready } = useCatalog()
  // Las respuestas mencionan zonas, horario y tope mayorista: esperamos los reales.
  const items = useMemo(() => buildFaq(settings), [settings])

  return (
    <Section id="faq" eyebrow="FAQ" title="Preguntas frecuentes">
      {ready ? (
        <Accordion items={items} />
      ) : (
        <p className="text-muted" aria-busy>
          Cargando…
        </p>
      )}
    </Section>
  )
}
