import { useEffect, useState } from 'react'
import { HORARIO_ENVIOS, TIMEZONE } from '../config'
import { isShippingOpen, shippingLabel } from '../lib/schedule'

/** Estado de envíos según la hora de Argentina; se refresca cada minuto. */
export function useShippingStatus() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  return {
    open: isShippingOpen(now, HORARIO_ENVIOS, TIMEZONE),
    label: shippingLabel(now, HORARIO_ENVIOS, TIMEZONE),
  }
}
