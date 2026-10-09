import { describe, expect, it } from 'vitest'
import type { CheckoutValues } from './checkout'
import { buildOrderMessage, buildWhatsAppUrl } from './whatsapp'

const base: CheckoutValues = {
  nombre: 'Juan',
  entrega: 'envio',
  localidad: 'Tigre',
  direccion: 'Calle 123',
  puntoRetiro: '',
  metodoPago: 'Efectivo',
  efectivoCon: '100000',
  observaciones: '',
}
const lines = [
  { emoji: '🍓', nombre: 'Frutilla', quantity: 2 },
  { emoji: '🍒', nombre: 'Cereza', quantity: 1 },
]
const summary = { unitPrice: 25000, total: 75000, savings: 6000 }

describe('mensaje de WhatsApp', () => {
  it('incluye sabores, cantidades, precio, total, localidad, dirección y pago', () => {
    const m = buildOrderMessage('chipavapos.zn', 'ELFBAR KING 40K Puffs', lines, summary, base)
    expect(m).toContain('🍓 Frutilla x2')
    expect(m).toContain('🍒 Cereza x1')
    expect(m).toContain('Localidad: Tigre')
    expect(m).toContain('Dirección: Calle 123')
    expect(m).toContain('Pago: Efectivo')
    expect(m).toContain('Paga con:')
    expect(m).toMatch(/Total: .*75\.000/)
  })
  it('transferencia pide mandar comprobante y no menciona cambio', () => {
    const m = buildOrderMessage('x', 'y', lines, summary, { ...base, metodoPago: 'Transferencia' })
    expect(m).toContain('comprobante')
    expect(m).not.toContain('Paga con')
  })
  it('retiro usa el punto en vez de dirección', () => {
    const m = buildOrderMessage('x', 'y', lines, summary, {
      ...base,
      entrega: 'retiro',
      puntoRetiro: 'Olivos',
    })
    expect(m).toContain('Retiro en: Olivos')
    expect(m).not.toContain('Dirección')
  })
})

describe('buildWhatsAppUrl', () => {
  it('codifica el texto', () => {
    expect(buildWhatsAppUrl('549', 'hola mundo\n')).toBe('https://wa.me/549?text=hola%20mundo%0A')
  })
})
