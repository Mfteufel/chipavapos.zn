/**
 * Capa de acceso a datos. Hoy lee de src/data; cuando haya backend,
 * reemplazá el cuerpo de estas funciones por un fetch a la API (misma firma).
 */
import { MAYORISTA_DESDE, PRICE_TIERS, type PriceTier } from '../data/pricing'
import { MODELO, products, type Product } from '../data/products'

export async function getProducts(): Promise<Product[]> {
  return structuredClone(products)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug)
}

export async function getPricing(): Promise<{ tiers: PriceTier[]; mayoristaDesde: number }> {
  return { tiers: [...PRICE_TIERS], mayoristaDesde: MAYORISTA_DESDE }
}

export async function getModelName(): Promise<string> {
  return MODELO
}
