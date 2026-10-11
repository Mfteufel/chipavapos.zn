import { describe, expect, it } from 'vitest'
import type { Settings } from '../data/settings'
import { normalizeSettings, validateSettings, validateTiers } from './adminValidation'

const tiersOk = [
  { min: 1, precioUnitario: 27000 },
  { min: 3, precioUnitario: 25000 },
  { min: 5, precioUnitario: 24000 },
]

describe('validateTiers', () => {
  it('acepta una escala correcta', () => {
    expect(validateTiers(tiersOk)).toEqual([])
  })

  it('exige al menos un escalón', () => {
    expect(validateTiers([])).toHaveLength(1)
  })

  it('exige que la escala arranque en 1 unidad', () => {
    const errs = validateTiers([{ min: 2, precioUnitario: 27000 }])
    expect(errs.join(' ')).toMatch(/empezar en 1 unidad/)
  })

  it('rechaza cantidades repetidas', () => {
    const errs = validateTiers([
      { min: 1, precioUnitario: 27000 },
      { min: 1, precioUnitario: 26000 },
    ])
    expect(errs.join(' ')).toMatch(/dos escalones/)
  })

  it('rechaza cantidades y precios vacíos o no enteros', () => {
    expect(validateTiers([{ min: NaN, precioUnitario: 27000 }]).length).toBeGreaterThan(0)
    expect(validateTiers([{ min: 1, precioUnitario: NaN }]).length).toBeGreaterThan(0)
    expect(validateTiers([{ min: 1.5, precioUnitario: 27000 }]).length).toBeGreaterThan(0)
    expect(validateTiers([{ min: 1, precioUnitario: -10 }]).length).toBeGreaterThan(0)
  })

  it('avisa si comprar más sale más caro por unidad', () => {
    const errs = validateTiers([
      { min: 1, precioUnitario: 24000 },
      { min: 5, precioUnitario: 27000 },
    ])
    expect(errs.join(' ')).toMatch(/sube en vez de bajar/)
  })

  it('permite que dos escalones tengan el mismo precio', () => {
    expect(
      validateTiers([
        { min: 1, precioUnitario: 27000 },
        { min: 3, precioUnitario: 27000 },
      ]),
    ).toEqual([])
  })

  it('no repite el mismo mensaje', () => {
    const errs = validateTiers([
      { min: NaN, precioUnitario: 27000 },
      { min: NaN, precioUnitario: 26000 },
    ])
    expect(new Set(errs).size).toBe(errs.length)
  })
})

const settingsOk: Settings = {
  modelo: 'ELFBAR KING 40K Puffs',
  mayoristaDesde: 50,
  horario: { desde: '15:00', hasta: '22:00' },
  zonas: ['Tigre', 'Pilar'],
}

describe('validateSettings', () => {
  it('acepta settings correctos', () => {
    expect(validateSettings(settingsOk)).toEqual([])
  })

  it('acepta un horario que cruza la medianoche', () => {
    expect(
      validateSettings({ ...settingsOk, horario: { desde: '20:00', hasta: '02:00' } }),
    ).toEqual([])
  })

  it('rechaza horarios mal escritos', () => {
    expect(
      validateSettings({ ...settingsOk, horario: { desde: '25:00', hasta: '22:00' } }).length,
    ).toBeGreaterThan(0)
    expect(
      validateSettings({ ...settingsOk, horario: { desde: '9:00', hasta: '22:00' } }).length,
    ).toBeGreaterThan(0)
  })

  it('rechaza que el horario empiece y termine a la misma hora', () => {
    const errs = validateSettings({ ...settingsOk, horario: { desde: '15:00', hasta: '15:00' } })
    expect(errs.join(' ')).toMatch(/no pueden ser iguales/)
  })

  it('exige al menos una zona', () => {
    expect(validateSettings({ ...settingsOk, zonas: [] }).join(' ')).toMatch(/al menos una zona/)
  })

  it('detecta zonas repetidas sin importar mayúsculas', () => {
    const errs = validateSettings({ ...settingsOk, zonas: ['Tigre', 'tigre'] })
    expect(errs.join(' ')).toMatch(/repetidas/)
  })

  it('exige un modelo y un mínimo mayorista válidos', () => {
    expect(validateSettings({ ...settingsOk, modelo: '   ' }).length).toBeGreaterThan(0)
    expect(validateSettings({ ...settingsOk, mayoristaDesde: 0 }).length).toBeGreaterThan(0)
  })
})

describe('normalizeSettings', () => {
  it('recorta espacios y descarta las zonas vacías', () => {
    const s = normalizeSettings({
      ...settingsOk,
      modelo: '  ELFBAR  ',
      zonas: ['  Tigre  ', '', '   ', 'Pilar'],
    })
    expect(s.modelo).toBe('ELFBAR')
    expect(s.zonas).toEqual(['Tigre', 'Pilar'])
  })

  it('deja el mínimo mayorista como entero', () => {
    expect(normalizeSettings({ ...settingsOk, mayoristaDesde: 50.9 }).mayoristaDesde).toBe(50)
  })
})
