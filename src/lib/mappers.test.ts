import { describe, expect, it } from 'vitest'
import { defaultSettings } from '../data/settings'
import {
  toAcento,
  toProduct,
  toSettings,
  toSettingsOrDefault,
  toSettingsRow,
  toTiers,
  type ProductRow,
  type SettingsRow,
} from './mappers'

const row: ProductRow = {
  id: 'elfbar-king-frutilla',
  slug: 'frutilla',
  nombre: 'Frutilla',
  emoji: '🍓',
  descripcion: 'Dulce.',
  stock: 7,
  precio: 27000,
  es_promo: true,
  imagen: '/products/frutilla.svg',
  acento: 'frutilla',
  orden: 1,
}

describe('toProduct', () => {
  it('traduce snake_case a los campos de la app', () => {
    expect(toProduct(row)).toEqual({
      id: 'elfbar-king-frutilla',
      slug: 'frutilla',
      nombre: 'Frutilla',
      emoji: '🍓',
      descripcion: 'Dulce.',
      stock: 7,
      precio: 27000,
      esPromo: true,
      imagen: '/products/frutilla.svg',
      acento: 'frutilla',
    })
  })

  it('tolera los textos opcionales en null', () => {
    const p = toProduct({ ...row, emoji: null, descripcion: null, imagen: null })
    expect(p.emoji).toBe('')
    expect(p.descripcion).toBe('')
    expect(p.imagen).toBe('')
  })

  it('nunca devuelve stock ni precio negativos', () => {
    const p = toProduct({ ...row, stock: -5, precio: -1 })
    expect(p.stock).toBe(0)
    expect(p.precio).toBe(0)
  })

  it('cae a un acento válido si la base trae uno desconocido', () => {
    expect(toProduct({ ...row, acento: 'menta' }).acento).toBe('frutilla')
    expect(toAcento('sandia')).toBe('sandia')
  })
})

describe('toTiers', () => {
  it('ordena por cantidad mínima', () => {
    const tiers = toTiers([
      { min: 5, precio_unitario: 24000 },
      { min: 1, precio_unitario: 27000 },
      { min: 3, precio_unitario: 25000 },
    ])
    expect(tiers.map((t) => t.min)).toEqual([1, 3, 5])
    expect(tiers[0].precioUnitario).toBe(27000)
  })

  it('devuelve lista vacía si no hay filas', () => {
    expect(toTiers([])).toEqual([])
  })
})

describe('settings', () => {
  const settingsRow: SettingsRow = {
    modelo: 'ELFBAR KING 40K Puffs',
    mayorista_desde: 50,
    horario_desde: '15:00',
    horario_hasta: '22:00',
    zonas: ['Tigre', 'Pilar'],
  }

  it('arma el horario anidado y las zonas', () => {
    expect(toSettings(settingsRow)).toEqual({
      modelo: 'ELFBAR KING 40K Puffs',
      mayoristaDesde: 50,
      horario: { desde: '15:00', hasta: '22:00' },
      zonas: ['Tigre', 'Pilar'],
    })
  })

  it('trata zonas en null como lista vacía', () => {
    expect(toSettings({ ...settingsRow, zonas: null }).zonas).toEqual([])
  })

  it('usa los valores por defecto si todavía no hay fila', () => {
    expect(toSettingsOrDefault(null)).toEqual(defaultSettings)
  })

  it('vuelve a la forma de la base sin perder datos', () => {
    const ida = toSettings(settingsRow)
    const vuelta = toSettingsRow(ida)
    expect(vuelta).toEqual({ id: 1, ...settingsRow })
    expect(toSettings(vuelta)).toEqual(ida)
  })
})
