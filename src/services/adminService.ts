/**
 * Escrituras del panel y sesión del admin.
 * Todo esto requiere estar logueado: el RLS de Supabase rechaza al resto.
 */
import type { Session } from '@supabase/supabase-js'
import type { PriceTier } from '../data/pricing'
import type { Settings } from '../data/settings'
import { toSettingsRow } from '../lib/mappers'
import { requireSupabase } from '../lib/supabase'

// ---------- Sesión ----------

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  const { data } = await requireSupabase().auth.getSession()
  return data.session
}

/** Devuelve la función para desuscribirse. */
export function onAuthChange(cb: (session: Session | null) => void): () => void {
  const { data } = requireSupabase().auth.onAuthStateChange((_event, session) => cb(session))
  return () => data.subscription.unsubscribe()
}

// ---------- Escrituras ----------

/** Campos de un producto que el panel puede tocar. Nombre, slug y acento no se editan acá. */
export interface ProductPatch {
  stock: number
  precio: number
  esPromo: boolean
}

export async function updateProduct(id: string, patch: ProductPatch): Promise<void> {
  const { error } = await requireSupabase()
    .from('products')
    .update({
      stock: Math.max(0, Math.trunc(patch.stock)),
      precio: Math.max(0, Math.trunc(patch.precio)),
      es_promo: patch.esPromo,
    })
    .eq('id', id)
  if (error) throw error
}

export async function saveTiers(tiers: PriceTier[]): Promise<void> {
  const payload = tiers
    .map((t) => ({ min: Math.trunc(t.min), precio_unitario: Math.trunc(t.precioUnitario) }))
    .sort((a, b) => a.min - b.min)
  const { error } = await requireSupabase().rpc('replace_price_tiers', { tiers: payload })
  if (error) throw error
}

export async function saveSettings(settings: Settings): Promise<void> {
  const { error } = await requireSupabase().from('settings').upsert(toSettingsRow(settings))
  if (error) throw error
}
