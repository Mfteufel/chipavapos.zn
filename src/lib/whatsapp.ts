import type { CheckoutValues } from './checkout'
import { formatPrice } from './format'
import type { CartSummary } from './pricing'

export interface OrderLine {
  emoji: string
  nombre: string
  quantity: number
}

export function buildWhatsAppUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function buildOrderMessage(
  businessName: string,
  modelo: string,
  lines: OrderLine[],
  summary: Pick<CartSummary, 'unitPrice' | 'total' | 'savings'>,
  v: CheckoutValues,
): string {
  const out: string[] = [`¡Hola ${businessName}! Quiero hacer este pedido:`, '', `*${modelo}*`]
  for (const l of lines) out.push(`${l.emoji} ${l.nombre} x${l.quantity}`)
  out.push('', `Precio unitario: ${formatPrice(summary.unitPrice)}`)
  if (summary.savings > 0) out.push(`Ahorro: ${formatPrice(summary.savings)}`)
  out.push(`*Total: ${formatPrice(summary.total)}*`, '')
  out.push(`Nombre: ${v.nombre}`)
  if (v.entrega === 'retiro') {
    out.push(`Retiro en: ${v.puntoRetiro}`)
  } else {
    out.push(`Localidad: ${v.localidad}`, `Dirección: ${v.direccion}`)
  }
  out.push(`Pago: ${v.metodoPago}`)
  if (v.metodoPago === 'Efectivo' && v.efectivoCon) {
    out.push(`Paga con: ${formatPrice(Number(v.efectivoCon))}`)
  }
  if (v.metodoPago === 'Transferencia') out.push('Te mando el comprobante por acá.')
  if (v.observaciones) out.push(`Observaciones: ${v.observaciones}`)
  return out.join('\n')
}

export function buildWholesaleMessage(businessName: string, units: number): string {
  return `¡Hola ${businessName}! Quiero hacer un pedido mayorista de ${units} unidades. ¿Me pasás precios?`
}
