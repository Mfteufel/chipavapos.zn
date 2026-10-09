import { describe, expect, it } from 'vitest'
import type { PriceTier } from '../data/pricing'
import {
  clampQuantity,
  getNextTier,
  getTierIndex,
  getUnitPrice,
  remainingStock,
  summarizeCart,
} from './pricing'

const tiers: PriceTier[] = [
  { min: 1, precioUnitario: 27000 },
  { min: 3, precioUnitario: 25000 },
  { min: 5, precioUnitario: 24000 },
]

describe('getUnitPrice', () => {
  it('devuelve 0 sin unidades', () => expect(getUnitPrice(0, tiers)).toBe(0))
  it.each([
    [1, 27000],
    [2, 27000],
    [3, 25000],
    [4, 25000],
    [5, 24000],
    [40, 24000],
  ])('con %i unidades cobra %i c/u', (units, price) => {
    expect(getUnitPrice(units, tiers)).toBe(price)
  })
  it('funciona con tiers desordenados', () => {
    expect(getUnitPrice(3, [...tiers].reverse())).toBe(25000)
  })
})

describe('getTierIndex', () => {
  it('-1 sin unidades y el índice correcto con unidades', () => {
    expect(getTierIndex(0, tiers)).toBe(-1)
    expect(getTierIndex(4, tiers)).toBe(1)
    expect(getTierIndex(5, tiers)).toBe(2)
  })
})

describe('getNextTier', () => {
  it('indica cuánto falta', () => {
    expect(getNextTier(1, tiers)).toEqual({ faltan: 2, precioUnitario: 25000 })
    expect(getNextTier(3, tiers)).toEqual({ faltan: 2, precioUnitario: 24000 })
  })
  it('null en el último escalón', () => expect(getNextTier(5, tiers)).toBeNull())
})

describe('summarizeCart', () => {
  it('carrito vacío', () => {
    const s = summarizeCart([], tiers, 50)
    expect(s).toMatchObject({
      totalUnits: 0,
      total: 0,
      savings: 0,
      nextTier: null,
      isWholesale: false,
    })
  })
  it('combina sabores para el escalón', () => {
    const s = summarizeCart(
      [
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 1 },
      ],
      tiers,
      50,
    )
    expect(s.totalUnits).toBe(3)
    expect(s.unitPrice).toBe(25000)
    expect(s.total).toBe(75000)
    expect(s.savings).toBe(6000)
    expect(s.nextTier).toEqual({ faltan: 2, precioUnitario: 24000 })
  })
  it('sin ahorro en el primer escalón', () => {
    expect(summarizeCart([{ productId: 'a', quantity: 2 }], tiers, 50).savings).toBe(0)
  })
  it('marca mayorista desde el umbral', () => {
    expect(summarizeCart([{ productId: 'a', quantity: 49 }], tiers, 50).isWholesale).toBe(false)
    expect(summarizeCart([{ productId: 'a', quantity: 50 }], tiers, 50).isWholesale).toBe(true)
  })
})

describe('stock', () => {
  it('remainingStock nunca es negativo', () => {
    expect(remainingStock(10, 4)).toBe(6)
    expect(remainingStock(3, 5)).toBe(0)
  })
  it('clampQuantity respeta el stock', () => {
    expect(clampQuantity(5, 10, 0)).toBe(5)
    expect(clampQuantity(8, 10, 5)).toBe(5)
    expect(clampQuantity(3, 10, 10)).toBe(0)
    expect(clampQuantity(-2, 10)).toBe(0)
  })
})
