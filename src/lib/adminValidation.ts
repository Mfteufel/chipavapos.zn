/**
 * Validaciones del panel. Puras y sin React para poder testearlas.
 * El servidor igual valida con los CHECK de supabase/schema.sql: esto es
 * para dar un mensaje claro antes de mandar.
 */
import type { PriceTier } from '../data/pricing'
import type { Settings } from '../data/settings'

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/

export function validateTiers(tiers: PriceTier[]): string[] {
  const errores: string[] = []

  if (tiers.length === 0) {
    return ['Tiene que haber al menos un escalón de precio.']
  }
  if (!tiers.some((t) => t.min === 1)) {
    errores.push('El primer escalón tiene que empezar en 1 unidad.')
  }

  const vistos = new Set<number>()
  for (const t of tiers) {
    if (!Number.isInteger(t.min) || t.min < 1) {
      errores.push('Hay una cantidad vacía o inválida. Tiene que ser un número entero de 1 o más.')
    } else if (vistos.has(t.min)) {
      errores.push(`Hay dos escalones que empiezan en ${t.min} unidades.`)
    } else {
      vistos.add(t.min)
    }

    if (!Number.isInteger(t.precioUnitario) || t.precioUnitario < 0) {
      errores.push('Hay un precio vacío o inválido en la escala.')
    }
  }

  // Comprar más tiene que salir igual o más barato por unidad, nunca más caro.
  const ordenados = tiers
    .filter((t) => Number.isInteger(t.min) && Number.isInteger(t.precioUnitario))
    .sort((a, b) => a.min - b.min)
  for (let i = 1; i < ordenados.length; i++) {
    if (ordenados[i].precioUnitario > ordenados[i - 1].precioUnitario) {
      errores.push(`Desde ${ordenados[i].min} unidades el precio sube en vez de bajar. Revisalo.`)
    }
  }

  return [...new Set(errores)]
}

export function validateSettings(s: Settings): string[] {
  const errores: string[] = []

  if (!s.modelo.trim()) errores.push('Poné el nombre del modelo.')

  if (!Number.isInteger(s.mayoristaDesde) || s.mayoristaDesde < 1) {
    errores.push('El mínimo mayorista tiene que ser un número entero de 1 o más.')
  }

  if (!HORA.test(s.horario.desde)) errores.push('Horario de inicio inválido (usá HH:MM).')
  if (!HORA.test(s.horario.hasta)) errores.push('Horario de fin inválido (usá HH:MM).')
  if (s.horario.desde === s.horario.hasta) {
    errores.push('El horario de inicio y el de fin no pueden ser iguales.')
  }

  const zonas = s.zonas.map((z) => z.trim()).filter(Boolean)
  if (zonas.length === 0) errores.push('Agregá al menos una zona de envío.')
  if (new Set(zonas.map((z) => z.toLowerCase())).size !== zonas.length) {
    errores.push('Hay zonas repetidas.')
  }

  return [...new Set(errores)]
}

/** Deja los settings listos para guardar: recorta y saca zonas vacías. */
export function normalizeSettings(s: Settings): Settings {
  return {
    modelo: s.modelo.trim(),
    mayoristaDesde: Math.trunc(s.mayoristaDesde),
    horario: { desde: s.horario.desde.trim(), hasta: s.horario.hasta.trim() },
    zonas: s.zonas.map((z) => z.trim()).filter(Boolean),
  }
}
