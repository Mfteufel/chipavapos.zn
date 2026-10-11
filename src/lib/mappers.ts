/**
 * Traducción entre las filas de Supabase (snake_case) y los tipos de la app.
 * Va separado del cliente para poder testearlo sin red ni variables de entorno.
 */
import type { PriceTier } from '../data/pricing'
import { ACENTOS, type Acento, type Product } from '../data/products'
import { defaultSettings, type Settings } from '../data/settings'

export interface ProductRow {
  id: string
  slug: string
  nombre: string
  emoji: string | null
  descripcion: string | null
  stock: number
  precio: number
  es_promo: boolean
  imagen: string | null
  acento: string
  orden: number
}

export interface TierRow {
  min: number
  precio_unitario: number
}

export interface SettingsRow {
  modelo: string
  mayorista_desde: number
  horario_desde: string
  horario_hasta: string
  zonas: string[] | null
}

/** Un acento desconocido no debe romper la página: cae al primero. */
export function toAcento(value: string): Acento {
  return (ACENTOS as readonly string[]).includes(value) ? (value as Acento) : ACENTOS[0]
}

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    emoji: row.emoji ?? '',
    descripcion: row.descripcion ?? '',
    stock: Math.max(0, Math.trunc(row.stock)),
    precio: Math.max(0, Math.trunc(row.precio)),
    esPromo: row.es_promo,
    imagen: row.imagen ?? '',
    acento: toAcento(row.acento),
  }
}

export function toTier(row: TierRow): PriceTier {
  return { min: row.min, precioUnitario: row.precio_unitario }
}

export function toTiers(rows: TierRow[]): PriceTier[] {
  return rows.map(toTier).sort((a, b) => a.min - b.min)
}

export function toSettings(row: SettingsRow): Settings {
  return {
    modelo: row.modelo,
    mayoristaDesde: row.mayorista_desde,
    horario: { desde: row.horario_desde, hasta: row.horario_hasta },
    zonas: row.zonas ?? [],
  }
}

export function toSettingsRow(s: Settings): SettingsRow & { id: number } {
  return {
    id: 1,
    modelo: s.modelo,
    mayorista_desde: s.mayoristaDesde,
    horario_desde: s.horario.desde,
    horario_hasta: s.horario.hasta,
    zonas: s.zonas,
  }
}

/** Settings de la base, completando con los valores por defecto si falta la fila. */
export function toSettingsOrDefault(row: SettingsRow | null | undefined): Settings {
  return row ? toSettings(row) : defaultSettings
}
