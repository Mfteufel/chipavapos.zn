import { useEffect, useState } from 'react'
import { TIMEZONE } from '../config'
import { isShippingOpen, shippingLabel } from '../lib/schedule'
import { useCatalog } from './useCatalog'

/**
 * Estado de envíos según la hora de Argentina; se refresca cada minuto.
 * `ready` es false hasta que llega el horario real: mostrar el de ejemplo
 * haría anunciar un horario equivocado durante la carga.
 */
export function useShippingStatus() {
  const { settings, ready } = useCatalog()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return {
    ready,
    open: isShippingOpen(now, settings.horario, TIMEZONE),
    label: shippingLabel(now, settings.horario, TIMEZONE),
  }
}
