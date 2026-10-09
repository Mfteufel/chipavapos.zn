import type { PriceTier } from '../data/pricing'

export interface CartLine {
  productId: string
  quantity: number
}

export interface NextTierInfo {
  /** Unidades que faltan para llegar al próximo escalón. */
  faltan: number
  precioUnitario: number
}

export interface CartSummary {
  totalUnits: number
  /** Precio unitario según la cantidad total. 0 si el carrito está vacío. */
  unitPrice: number
  total: number
  /** Cuánto costaría todo al precio del primer escalón. */
  listTotal: number
  savings: number
  /** Índice del escalón vigente en `tiers`, -1 si el carrito está vacío. */
  currentTierIndex: number
  nextTier: NextTierInfo | null
  /** Se alcanzó la cantidad mayorista: el checkout online queda bloqueado. */
  isWholesale: boolean
}

const sortTiers = (tiers: PriceTier[]) => [...tiers].sort((a, b) => a.min - b.min)

export function getTotalUnits(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0)
}

/** Índice del escalón que corresponde a `units` (tiers ordenados por min). -1 si units < 1. */
export function getTierIndex(units: number, tiers: PriceTier[]): number {
  const sorted = sortTiers(tiers)
  let idx = -1
  sorted.forEach((t, i) => {
    if (units >= t.min) idx = i
  })
  return idx
}

export function getUnitPrice(units: number, tiers: PriceTier[]): number {
  const idx = getTierIndex(units, tiers)
  return idx === -1 ? 0 : sortTiers(tiers)[idx].precioUnitario
}

export function getNextTier(units: number, tiers: PriceTier[]): NextTierInfo | null {
  const next = sortTiers(tiers).find((t) => t.min > units)
  if (!next) return null
  return { faltan: next.min - units, precioUnitario: next.precioUnitario }
}

export function summarizeCart(
  lines: CartLine[],
  tiers: PriceTier[],
  mayoristaDesde: number,
): CartSummary {
  const totalUnits = getTotalUnits(lines)
  const sorted = sortTiers(tiers)
  const unitPrice = getUnitPrice(totalUnits, tiers)
  const total = unitPrice * totalUnits
  const listTotal = (sorted[0]?.precioUnitario ?? 0) * totalUnits
  return {
    totalUnits,
    unitPrice,
    total,
    listTotal,
    savings: Math.max(0, listTotal - total),
    currentTierIndex: getTierIndex(totalUnits, tiers),
    nextTier: totalUnits === 0 ? null : getNextTier(totalUnits, tiers),
    isWholesale: totalUnits >= mayoristaDesde,
  }
}

/** Cuántas unidades más se pueden agregar sin pasarse del stock. */
export function remainingStock(stock: number, inCart: number): number {
  return Math.max(0, stock - inCart)
}

/** Limita la cantidad pedida al stock disponible (nunca negativa). */
export function clampQuantity(desired: number, stock: number, inCart = 0): number {
  return Math.max(0, Math.min(Math.floor(desired), remainingStock(stock, inCart)))
}
