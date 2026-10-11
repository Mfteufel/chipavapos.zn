/**
 * Único punto de acceso a los datos de la tienda.
 * Ningún componente debe leer src/data/ directo: todo pasa por acá.
 */
import { PRICE_TIERS, type PriceTier } from '../data/pricing'
import { products as localProducts, type Product } from '../data/products'
import { defaultSettings, type Settings } from '../data/settings'
import {
  toProduct,
  toSettingsOrDefault,
  toTiers,
  type ProductRow,
  type SettingsRow,
  type TierRow,
} from '../lib/mappers'
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase'

export interface Catalog {
  products: Product[]
  tiers: PriceTier[]
  settings: Settings
}

function localCatalog(): Catalog {
  return {
    products: structuredClone(localProducts),
    tiers: structuredClone(PRICE_TIERS),
    settings: structuredClone(defaultSettings),
  }
}

export async function getCatalog(): Promise<Catalog> {
  if (!isSupabaseConfigured) {
    // En producción preferimos fallar visible: mostrar precios y stock de ejemplo
    // como si fueran reales es peor que mostrar un error.
    if (!import.meta.env.DEV) {
      throw new Error('Supabase no está configurado en este build')
    }
    return localCatalog()
  }

  const sb = requireSupabase()
  const [productsRes, tiersRes, settingsRes] = await Promise.all([
    sb.from('products').select('*').order('orden', { ascending: true }),
    sb.from('price_tiers').select('*').order('min', { ascending: true }),
    sb.from('settings').select('*').eq('id', 1).maybeSingle(),
  ])

  const error = productsRes.error ?? tiersRes.error ?? settingsRes.error
  if (error) throw error

  return {
    products: ((productsRes.data ?? []) as ProductRow[]).map(toProduct),
    tiers: toTiers((tiersRes.data ?? []) as TierRow[]),
    settings: toSettingsOrDefault(settingsRes.data as SettingsRow | null),
  }
}
