import { useState } from 'react'
import { DATOS_TRANSFERENCIA } from '../../config'
import { Button } from '../ui/Button'

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function TransferInfo() {
  const { alias, cbu, titular } = DATOS_TRANSFERENCIA
  const [copied, setCopied] = useState<'ok' | 'error' | null>(null)
  const handleCopy = async () => {
    setCopied((await copy(alias)) ? 'ok' : 'error')
    setTimeout(() => setCopied(null), 2500)
  }
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface2 p-4 text-sm">
      {alias || cbu ? (
        <dl className="space-y-1">
          {alias && (
            <div className="flex gap-2">
              <dt className="text-muted">Alias:</dt>
              <dd className="font-semibold">{alias}</dd>
            </div>
          )}
          {cbu && (
            <div className="flex gap-2">
              <dt className="text-muted">CBU:</dt>
              <dd className="break-all font-semibold">{cbu}</dd>
            </div>
          )}
          {titular && (
            <div className="flex gap-2">
              <dt className="text-muted">Titular:</dt>
              <dd className="font-semibold">{titular}</dd>
            </div>
          )}
        </dl>
      ) : (
        <p>Te pasamos los datos de la cuenta por WhatsApp al confirmar el pedido.</p>
      )}
      {alias && (
        <Button variant="secondary" onClick={handleCopy} className="w-full">
          {copied === 'ok'
            ? '¡Alias copiado!'
            : copied === 'error'
              ? 'No se pudo copiar'
              : 'Copiar alias'}
        </Button>
      )}
      <p className="font-semibold text-amber-400">Mandá el comprobante por WhatsApp.</p>
    </div>
  )
}
