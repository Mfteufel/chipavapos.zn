export interface ShippingHours {
  desde: string
  hasta: string
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** Minutos desde medianoche de `date` en la zona horaria indicada. */
export function minutesInZone(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const h = Number(parts.find((p) => p.type === 'hour')?.value) % 24
  const m = Number(parts.find((p) => p.type === 'minute')?.value)
  return h * 60 + m
}

export function isShippingOpen(date: Date, hours: ShippingHours, timeZone: string): boolean {
  const now = minutesInZone(date, timeZone)
  const from = toMinutes(hours.desde)
  const to = toMinutes(hours.hasta)
  return from <= to ? now >= from && now < to : now >= from || now < to
}

export function shippingLabel(date: Date, hours: ShippingHours, timeZone: string): string {
  return isShippingOpen(date, hours, timeZone)
    ? 'Envíos abiertos ahora'
    : `Envíos desde las ${hours.desde} hs`
}
