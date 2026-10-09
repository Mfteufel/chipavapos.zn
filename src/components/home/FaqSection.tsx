import { FAQ } from '../../data/faq'
import { Accordion } from '../ui/Accordion'
import { Section } from '../ui/Section'

export function FaqSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Preguntas frecuentes">
      <Accordion items={FAQ} />
    </Section>
  )
}
