import { BUSINESS_NAME, WHATSAPP_NUMBER } from '../../config'
import { buildWhatsAppUrl, buildWholesaleMessage } from '../../lib/whatsapp'
import { buttonClass } from '../ui/buttonStyles'

export function WholesaleNotice({ units, from }: { units: number; from: number }) {
  return (
    <div
      role="alert"
      className="space-y-3 rounded-2xl border border-amber-400/50 bg-amber-400/10 p-4"
    >
      <p className="font-semibold">Pedidos de {from} o más unidades</p>
      <p className="text-sm text-muted">
        Los pedidos mayoristas no se compran online. Escribinos y te pasamos precio especial.
      </p>
      <a
        href={buildWhatsAppUrl(WHATSAPP_NUMBER, buildWholesaleMessage(BUSINESS_NAME, units))}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass('whatsapp', 'w-full')}
      >
        Pedido mayorista por WhatsApp
      </a>
    </div>
  )
}
