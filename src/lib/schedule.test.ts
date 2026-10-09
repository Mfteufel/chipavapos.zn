import { describe, expect, it } from 'vitest'
import { isShippingOpen, shippingLabel } from './schedule'

const hours = { desde: '15:00', hasta: '22:00' }
const tz = 'America/Argentina/Buenos_Aires' // UTC-3, sin horario de verano
// 18:00 en Buenos Aires = 21:00 UTC
const at = (utc: string) => new Date(`2026-01-10T${utc}:00Z`)

describe('horario de envíos', () => {
  it('abierto dentro del horario', () => {
    expect(isShippingOpen(at('21:00'), hours, tz)).toBe(true)
    expect(shippingLabel(at('21:00'), hours, tz)).toBe('Envíos abiertos ahora')
  })
  it('cerrado antes de abrir (usa hora de Argentina, no UTC)', () => {
    // 14:59 AR = 17:59 UTC
    expect(isShippingOpen(at('17:59'), hours, tz)).toBe(false)
    expect(shippingLabel(at('17:59'), hours, tz)).toBe('Envíos desde las 15:00 hs')
  })
  it('abre justo a la hora de inicio y cierra a la de fin', () => {
    expect(isShippingOpen(at('18:00'), hours, tz)).toBe(true)
    expect(isShippingOpen(at('01:00'), hours, tz)).toBe(false) // 22:00 AR
  })
  it('soporta horarios que cruzan medianoche', () => {
    const night = { desde: '20:00', hasta: '02:00' }
    expect(isShippingOpen(at('03:00'), night, tz)).toBe(true) // 00:00 AR
    expect(isShippingOpen(at('15:00'), night, tz)).toBe(false) // 12:00 AR
  })
})
