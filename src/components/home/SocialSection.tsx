import { INSTAGRAM_URL, WHATSAPP_NUMBER } from '../../config'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from '../ui/Icons'
import { buttonClass } from '../ui/buttonStyles'
import { Section } from '../ui/Section'

export function SocialSection() {
  return (
    <Section eyebrow="Contacto" title="Escribinos">
      <div className="flex flex-col gap-6 rounded-3xl border border-brand/30 bg-gradient-to-br from-brand-strong/25 via-surface to-surface p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-lg">
          ¿Dudas o querés consultar stock? Hablamos por WhatsApp
          {INSTAGRAM_URL && ' o seguinos en Instagram'}.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={buildWhatsAppUrl(WHATSAPP_NUMBER, 'Hola! Quería hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('whatsapp')}
          >
            <WhatsAppIcon className="size-5" /> WhatsApp
          </a>
          {INSTAGRAM_URL && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('secondary')}
            >
              <InstagramIcon className="size-5" /> Instagram
            </a>
          )}
        </div>
      </div>
    </Section>
  )
}
